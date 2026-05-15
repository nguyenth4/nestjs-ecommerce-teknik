import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdersGateway } from './orders.gateway';

export type OrderQueuePayload = { orderId: string };

@Processor('orders')
export class OrdersQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(OrdersQueueProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersGateway: OrdersGateway,
  ) {
    super();
  }

  async process(job: Job<OrderQueuePayload>): Promise<void> {
    switch (job.name) {
      case 'order-email':
        return this.sendOrderEmail(job.data.orderId);
      case 'order-expire':
        return this.expireIfStillPending(job.data.orderId);
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async sendOrderEmail(orderId: string): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { select: { email: true, fullName: true } }, items: true },
    });
    if (!order) return;
    this.logger.log(
      `[order-email] Xác nhận đơn ${orderId} tới ${order.user.email} (${order.user.fullName}) — ${order.items.length} dòng, tổng ${order.totalAmount}`,
    );
  }

  private async expireIfStillPending(orderId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order || order.status !== 'pending') {
        return;
      }
      for (const item of order.items) {
        const inv = await tx.inventory.findUnique({ where: { productId: item.productId } });
        if (inv) {
          await tx.inventory.update({
            where: { productId: item.productId },
            data: { quantity: { increment: item.quantity } },
          });
        }
      }
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'cancelled' },
      });
    });
    const updated = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { userId: true, status: true },
    });
    if (updated?.status === 'cancelled') {
      this.ordersGateway.emitOrderStatus(updated.userId, {
        orderId,
        status: 'cancelled',
      });
    }
    this.logger.log(`[order-expire] Đã hủy đơn quá hạn thanh toán: ${orderId}`);
  }
}
