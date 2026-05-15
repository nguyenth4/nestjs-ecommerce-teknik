import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from '../../prisma/prisma.service';
import { MockPaymentDto } from './dto/mock-payment.dto';
import { REDIS } from '../../redis/redis.module';
import { OrdersGateway } from '../orders/orders.gateway';
import { AuditLogService } from '../../audit/audit-log.service';

const PAY_IDEM_PREFIX = 'payment:mock:';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS) private readonly redis: Redis,
    private readonly ordersGateway: OrdersGateway,
    private readonly auditLog: AuditLogService,
  ) {}

  async mockPay(userId: string, dto: MockPaymentDto) {
    if (dto.idempotencyKey) {
      try {
        const cached = await this.redis.get(`${PAY_IDEM_PREFIX}${dto.idempotencyKey}`);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch {
        /* continue without idempotency cache */
      }
    }

    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId, userId },
      include: { items: true },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status !== 'pending') {
      throw new BadRequestException('Only pending orders can be paid with mock payment');
    }

    const nextStatus = dto.succeed ? 'paid' : 'cancelled';

    await this.prisma.$transaction(async (tx) => {
      if (!dto.succeed) {
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
        where: { id: order.id },
        data: { status: nextStatus },
      });
    });

    const fresh = await this.prisma.order.findUnique({
      where: { id: order.id },
      include: { items: true },
    });

    this.ordersGateway.emitOrderStatus(userId, { orderId: order.id, status: nextStatus });

    await this.auditLog.log(userId, 'mock_payment', 'Order', order.id, {
      succeed: dto.succeed,
      idempotencyKey: dto.idempotencyKey,
    });

    const payload = { order: fresh, status: nextStatus };
    if (dto.idempotencyKey) {
      try {
        await this.redis.set(
          `${PAY_IDEM_PREFIX}${dto.idempotencyKey}`,
          JSON.stringify(payload),
          'EX',
          86400,
        );
      } catch {
        /* ignore */
      }
    }
    return payload;
  }
}
