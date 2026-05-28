import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'SKU không được để trống' })
  sku: string;

  @IsNumber({}, { message: 'Giá phải là số hợp lệ' })
  @Min(0, { message: 'Giá không được nhỏ hơn 0' })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: 'Mã danh mục (categoryId) không được để trống' })
  categoryId: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
