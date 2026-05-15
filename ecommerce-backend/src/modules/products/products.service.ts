import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { REDIS } from '../../redis/redis.module';

const LIST_KEY = 'products:list';
const CATEGORIES_KEY = 'products:categories';
const LIST_TTL_SEC = 60;
const CATEGORIES_TTL_SEC = 300;

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    @Inject(REDIS) private readonly redis: Redis,
  ) {}

  private async invalidateCaches() {
    try {
      await this.redis.del(LIST_KEY, CATEGORIES_KEY);
    } catch {
      /* ignore cache errors */
    }
  }

  async create(createProductDto: CreateProductDto) {
    let sku = createProductDto.sku;
    if (!sku || sku.trim() === '') {
      sku = `SKU-${Date.now().toString().slice(-6)}`;
    }
    const { initialStock, ...productFields } = createProductDto;
    try {
      const created = await this.prisma.product.create({
        data: {
          ...productFields,
          sku,
          inventory: {
            create: { quantity: initialStock ?? 100 },
          },
        },
        include: { category: true, inventory: true },
      });
      await this.invalidateCaches();
      return created;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('SKU already exists. Please choose a different SKU.');
      }
      throw error;
    }
  }

  async findAll() {
    try {
      const cached = await this.redis.get(LIST_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      /* fall through to DB */
    }

    const rows = await this.prisma.product.findMany({
      include: { category: true },
      orderBy: { sku: 'desc' },
    });

    try {
      await this.redis.set(LIST_KEY, JSON.stringify(rows), 'EX', LIST_TTL_SEC);
    } catch {
      /* ignore */
    }

    return rows;
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, inventory: true },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    try {
      const updated = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
      await this.invalidateCaches();
      return updated;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('SKU already exists. Please choose a different SKU.');
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    const removed = await this.prisma.product.delete({
      where: { id },
    });
    await this.invalidateCaches();
    return removed;
  }

  async getCategories() {
    try {
      const cached = await this.redis.get(CATEGORIES_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      /* fall through */
    }

    const rows = await this.prisma.category.findMany({
      where: { isActive: true },
    });

    try {
      await this.redis.set(CATEGORIES_KEY, JSON.stringify(rows), 'EX', CATEGORIES_TTL_SEC);
    } catch {
      /* ignore */
    }

    return rows;
  }
}
