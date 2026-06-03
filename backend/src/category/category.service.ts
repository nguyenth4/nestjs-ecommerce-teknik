import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = await this.prisma.category.create({
      data: createCategoryDto as any, // assuming DTO maps properly
    });
    await this.cacheManager.del('categories_list');
    return newCategory;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto as any,
    });
    await this.cacheManager.del('categories_list');
    return category;
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    const deletedCategory = await this.prisma.category.delete({
      where: { id },
    });
    await this.cacheManager.del('categories_list');
    return deletedCategory;
  }
}
