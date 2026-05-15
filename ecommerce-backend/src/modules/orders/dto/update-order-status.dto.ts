import { IsIn, IsNotEmpty, IsString } from 'class-validator';

const ORDER_STATUSES = [
  'pending',
  'paid',
  'processing',
  'shipped',
  'completed',
  'cancelled',
  'refunded',
] as const;

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn([...ORDER_STATUSES])
  status: (typeof ORDER_STATUSES)[number];
}
