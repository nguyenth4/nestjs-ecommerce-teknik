import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class MockPaymentDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsBoolean()
  succeed: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  idempotencyKey?: string;
}
