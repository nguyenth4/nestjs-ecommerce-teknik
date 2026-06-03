import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Processor('notification')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing notification job: ${job.name}`, job.data);

    // Ở đây có thể tích hợp thư viện gửi Email (Nodemailer, SendGrid,...)
    // Hoặc gửi Push Notification, SMS.
    // Tạm thời mô phỏng bằng console.log và lưu vào DB (bảng Notification)
    
    let message = '';

    if (job.name === 'order.created') {
      message = `Đơn hàng ${job.data.orderId} vừa được tạo thành công.`;
    } else if (job.name === 'order.paid') {
      message = `Đơn hàng ${job.data.orderId} đã được thanh toán.`;
    } else if (job.name === 'order.cancelled') {
      message = `Đơn hàng ${job.data.orderId} đã bị hủy.`;
    } else if (job.name === 'inventory.low_stock') {
      message = `Sản phẩm ${job.data.productId} sắp hết hàng.`;
    } else {
      message = `Có thông báo mới: ${job.name}`;
    }

    if (job.data.userId) {
      await this.prisma.notification.create({
        data: {
          userId: job.data.userId,
          title: `Cập nhật trạng thái đơn hàng`,
          message,
        },
      });
      this.logger.log(`Saved notification to database for user ${job.data.userId}`);
    }
  }
}
