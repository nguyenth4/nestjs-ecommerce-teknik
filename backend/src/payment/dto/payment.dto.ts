import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class MockPaymentDto {
  @ApiProperty({ description: 'ID của đơn hàng cần thanh toán' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Idempotency Key để chống trùng lặp request' })
  @IsNotEmpty()
  @IsString()
  idempotencyKey: string;

  @ApiProperty({ description: 'Mô phỏng thanh toán thành công hay thất bại' })
  @IsNotEmpty()
  @IsBoolean()
  success: boolean;
}
