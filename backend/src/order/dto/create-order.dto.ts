import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'Địa chỉ giao hàng', required: false })
  @IsOptional()
  @IsString()
  shippingAddress?: string;
}
