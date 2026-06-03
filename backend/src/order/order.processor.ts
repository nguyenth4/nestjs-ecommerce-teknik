import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { Logger } from '@nestjs/common';

@Processor('order')
export class OrderProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name} with data`, job.data);

    if (job.name === 'check-timeout') {
      const { orderId } = job.data;
      
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (order && order.status === OrderStatus.PENDING) {
        this.logger.log(`Order ${orderId} timeout reached. Cancelling...`);
        
        await this.prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.CANCELLED },
          });

          // Release inventory
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
                reason: `ORDER_TIMEOUT_${order.id}`,
              },
            });
          }
        });

        this.logger.log(`Order ${orderId} has been automatically cancelled.`);
      } else {
        this.logger.log(`Order ${orderId} is no longer pending. Skipping timeout check.`);
      }
    }
  }
}
