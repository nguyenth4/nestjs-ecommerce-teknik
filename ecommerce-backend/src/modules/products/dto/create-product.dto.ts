import { IsString, IsNumber, IsOptional, IsNotEmpty, Min, MaxLength, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  /** Initial stock row for inventory; defaults to 100 when omitted */
  @IsOptional()
  @IsInt()
  @Min(0)
  initialStock?: number;
}
