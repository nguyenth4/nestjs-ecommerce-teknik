import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty({ message: 'SKU không được để trống' })
  @IsOptional()
  sku?: string;

  @IsNumber({}, { message: 'Giá phải là số hợp lệ' })
  @Min(0, { message: 'Giá không được nhỏ hơn 0' })
  @IsOptional()
  price?: number;

  @IsString()
  @IsNotEmpty({ message: 'Mã danh mục (categoryId) không được để trống' })
  @IsOptional()
  categoryId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
