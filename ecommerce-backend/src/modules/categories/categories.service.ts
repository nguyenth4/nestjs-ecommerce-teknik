import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { REDIS } from '../../redis/redis.module';
import {
  CATEGORY_LIST_CACHE_KEY,
  CATEGORY_LIST_TTL_SEC,
  PRODUCT_LIST_CACHE_KEY,
} from '../../common/cache-keys';
import { AuditLogService } from '../../audit/audit-log.service';

function slugify(name: string): string {
  const s = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'category';
}

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS) private readonly redis: Redis,
    private readonly auditLog: AuditLogService,
  ) {}

  private async invalidateCaches() {
    try {
      await this.redis.del(PRODUCT_LIST_CACHE_KEY, CATEGORY_LIST_CACHE_KEY);
    } catch {
      /* ignore */
    }
  }

  async findAllActive() {
    try {
      const cached = await this.redis.get(CATEGORY_LIST_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      /* fall through */
    }
    const rows = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    try {
      await this.redis.set(CATEGORY_LIST_CACHE_KEY, JSON.stringify(rows), 'EX', CATEGORY_LIST_TTL_SEC);
    } catch {
      /* ignore */
    }
    return rows;
  }

  async findAllAdmin() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const c = await this.prisma.category.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Category not found');
    return c;
  }

  async create(dto: CreateCategoryDto, actorId: string) {
    const slug = dto.slug?.trim() || slugify(dto.name);
    try {
      const created = await this.prisma.category.create({
        data: {
          name: dto.name.trim(),
          slug,
          isActive: dto.isActive ?? true,
        },
      });
      await this.invalidateCaches();
      await this.auditLog.log(actorId, 'create', 'Category', created.id, { name: created.name });
      return created;
    } catch (e: any) {
      if (e.code === 'P2002') throw new ConflictException('Slug already exists');
      throw e;
    }
  }

  async update(id: string, dto: UpdateCategoryDto, actorId: string) {
    await this.findOne(id);
    try {
      const data: { name?: string; slug?: string; isActive?: boolean } = {};
      if (dto.name !== undefined) data.name = dto.name.trim();
      if (dto.slug !== undefined) data.slug = dto.slug.trim();
      if (dto.isActive !== undefined) data.isActive = dto.isActive;
      const updated = await this.prisma.category.update({ where: { id }, data });
      await this.invalidateCaches();
      await this.auditLog.log(actorId, 'update', 'Category', id, data);
      return updated;
    } catch (e: any) {
      if (e.code === 'P2002') throw new ConflictException('Slug already exists');
      throw e;
    }
  }

  async remove(id: string, actorId: string) {
    const count = await this.prisma.product.count({ where: { categoryId: id } });
    if (count > 0) {
      throw new ConflictException('Cannot delete category that still has products');
    }
    await this.findOne(id);
    await this.prisma.category.delete({ where: { id } });
    await this.invalidateCaches();
    await this.auditLog.log(actorId, 'delete', 'Category', id, {});
    return { ok: true };
  }
}
