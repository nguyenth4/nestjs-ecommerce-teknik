import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('order') private readonly orderQueue: Queue,
    @InjectQueue('notification') private readonly notificationQueue: Queue,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    // 1. Lấy giỏ hàng và kiểm tra
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { inventory: true },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Giỏ hàng trống');
    }

    let totalAmount = 0;

    // 2. Validate tồn kho & trạng thái sản phẩm
    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw new BadRequestException(`Sản phẩm ${item.product.name} không còn hoạt động`);
      }
      
      const inv = item.product.inventory;
      const availableStock = inv ? (inv.quantity - inv.reservedQuantity) : 0;
      
      if (availableStock < item.quantity) {
        throw new BadRequestException(`Sản phẩm ${item.product.name} không đủ tồn kho`);
      }

      totalAmount += item.quantity * item.product.price;
    }

    // 3. Thực hiện Transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // a. Tạo Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          shippingAddress: dto.shippingAddress,
          status: OrderStatus.PENDING,
        },
      });

      // b. Tạo OrderItem & Cập nhật Inventory
      for (const item of cart.items) {
        // Tạo OrderItem
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price, // Snapshot giá
          },
        });

        // Cập nhật Inventory (Tăng reservedQuantity)
        await tx.inventory.update({
          where: { productId: item.productId },
          data: {
            reservedQuantity: { increment: item.quantity },
          },
        });

        // Tạo InventoryLog
        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            quantityChanged: item.quantity,
            reason: `ORDER_CREATED_${newOrder.id}`,
          },
        });
      }

      // c. Xóa CartItem
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    // Schedule order timeout (delay 15 minutes = 900000 ms)
    // Dùng 1 phút (60000ms) để test nhanh
    await this.orderQueue.add('check-timeout', { orderId: order.id }, { delay: 60000 });

    // Enqueue notification (async)
    await this.notificationQueue.add('order.created', { orderId: order.id, userId });

    return order;
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: { 
        items: { include: { product: true } },
        user: { select: { firstName: true, lastName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    // Validate state transitions
    const validTransitions: Record<string, string[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (order.status !== status && !validTransitions[order.status]?.includes(status)) {
      throw new BadRequestException(`Không thể chuyển đơn hàng từ trạng thái ${order.status} sang ${status}`);
    }

    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status },
      });

      // Nếu đơn hàng bị hủy, release inventory (BR-06)
      if (status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
        for (const item of order.items) {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: {
              reservedQuantity: { decrement: item.quantity },
            },
          });
          
          await tx.inventoryLog.create({
            data: {
              productId: item.productId,
              quantityChanged: -item.quantity,
              reason: `ORDER_CANCELLED_${order.id}`,
            },
          });
        }
      }

      // TODO: Ghi AuditLog (BR-10)
      // await tx.auditLog.create({ ... })

      return updated;
    });

    // Bắn event qua notification queue (không cần await để chạy async)
    if (status === OrderStatus.PROCESSING) {
      this.notificationQueue.add('order.paid', { orderId: updatedOrder.id, userId: updatedOrder.userId });
    } else if (status === OrderStatus.CANCELLED) {
      this.notificationQueue.add('order.cancelled', { orderId: updatedOrder.id, userId: updatedOrder.userId });
    }

    // Broadcast realtime qua WebSocket
    this.realtimeGateway.broadcastOrderStatus(updatedOrder.id, status, updatedOrder.userId);

    return updatedOrder;
  }
}
