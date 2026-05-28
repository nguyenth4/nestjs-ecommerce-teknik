import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty({ message: 'Slug không được để trống' })
  @IsOptional()
  slug?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
