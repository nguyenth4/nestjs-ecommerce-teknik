import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Slug không được để trống' })
  slug: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
