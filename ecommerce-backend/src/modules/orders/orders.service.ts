import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdersGateway } from './orders.gateway';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { assertOrderTransition } from './order-status.util';
import { AuditLogService } from '../../audit/audit-log.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly ordersGateway: OrdersGateway,
    @InjectQueue('orders') private readonly ordersQueue: Queue,
    private readonly auditLog: AuditLogService,
  ) {}

  async checkout(userId: string, idempotencyKey?: string) {
    if (idempotencyKey) {
      const existing = await this.prisma.order.findUnique({
        where: { idempotencyKey },
        include: { items: true },
      });
      if (existing) {
        if (existing.userId !== userId) {
          throw new ConflictException('Idempotency key already used');
        }
        return existing;
      }
    }

    const order = await this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: { include: { inventory: true } },
            },
          },
        },
      });

      if (!cart?.items?.length) {
        throw new BadRequestException('Cart is empty');
      }

      for (const line of cart.items) {
        const p = line.product;
        if (p.status !== 'active') {
          throw new BadRequestException(`Product "${p.name}" is unavailable`);
        }
        if (!p.price || p.price <= 0) {
          throw new BadRequestException(`Product "${p.name}" is out of stock`);
        }
      }

      for (const line of cart.items) {
        if (line.product.inventory) {
          const updated = await tx.inventory.updateMany({
            where: {
              productId: line.productId,
              quantity: { gte: line.quantity },
            },
            data: { quantity: { decrement: line.quantity } },
          });
          if (updated.count !== 1) {
            throw new BadRequestException(`Insufficient stock for "${line.product.name}"`);
          }
        }
      }

      const totalAmount = cart.items.reduce(
        (sum, line) => sum + line.product.price * line.quantity,
        0,
      );

      const created = await tx.order.create({
        data: {
          userId,
          status: 'pending',
          totalAmount,
          idempotencyKey: idempotencyKey || undefined,
          items: {
            create: cart.items.map((line) => ({
              productId: line.productId,
              name: line.product.name,
              price: line.product.price,
              quantity: line.quantity,
            })),
          },
        },
        include: { items: true },
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return created;
    });

    const expireMs = +(this.config.get<string>('ORDER_PENDING_EXPIRE_MS') || `${24 * 60 * 60 * 1000}`);

    await this.ordersQueue.add('order-email', { orderId: order.id });
    await this.ordersQueue.add(
      'order-expire',
      { orderId: order.id },
      { delay: expireMs, removeOnComplete: true, removeOnFail: 100 },
    );

    return order;
  }

  async findMine(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  async findAllForAdmin() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: { select: { id: true, email: true, fullName: true } },
      },
    });
  }

  async findOneForUser(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.userId !== userId) {
      throw new ForbiddenException();
    }
    return order;
  }

  async updateStatusForAdmin(
    orderId: string,
    dto: UpdateOrderStatusDto,
    actorRole: string,
    actorId: string,
  ) {
    if (!['admin', 'staff'].includes(actorRole)) {
      throw new ForbiddenException();
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const prev = order.status;
    const next = dto.status;

    if (prev === next) {
      return order;
    }

    assertOrderTransition(prev, next);

    await this.prisma.$transaction(async (tx) => {
      if (next === 'cancelled' && prev !== 'cancelled' && prev !== 'refunded') {
        for (const item of order.items) {
          const inv = await tx.inventory.findUnique({ where: { productId: item.productId } });
          if (inv) {
            await tx.inventory.update({
              where: { productId: item.productId },
              data: { quantity: { increment: item.quantity } },
            });
          }
        }
      }

      await tx.order.update({
        where: { id: orderId },
        data: { status: next },
      });
    });

    const fresh = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: { select: { id: true, email: true } } },
    });

    this.ordersGateway.emitOrderStatus(order.userId, {
      orderId,
      status: next,
    });

    await this.auditLog.log(actorId, 'order_status_change', 'Order', orderId, {
      from: prev,
      to: next,
    });

    return fresh;
  }
}
