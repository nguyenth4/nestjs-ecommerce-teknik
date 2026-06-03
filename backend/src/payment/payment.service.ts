import { Injectable, BadRequestException } from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { MockPaymentDto } from './dto/payment.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  // In-memory store for idempotency keys (can be replaced by Redis later)
  private processedKeys = new Set<string>();

  constructor(private readonly orderService: OrderService) {}

  async processMockPayment(dto: MockPaymentDto) {
    if (this.processedKeys.has(dto.idempotencyKey)) {
      return { success: true, message: 'Request đã được xử lý trước đó (Idempotent).' };
    }

    try {
      if (dto.success) {
        await this.orderService.updateOrderStatus(dto.orderId, OrderStatus.PROCESSING);
        this.processedKeys.add(dto.idempotencyKey);
        return { success: true, message: 'Thanh toán thành công. Đơn hàng đã chuyển sang PROCESSING.' };
      } else {
        // You might want to update the order to FAILED or CANCELLED, depending on business rules.
        // For now, just throwing an error.
        throw new BadRequestException('Thanh toán thất bại.');
      }
    } catch (error) {
      throw new BadRequestException(error.message || 'Lỗi xử lý thanh toán.');
    }
  }
}
