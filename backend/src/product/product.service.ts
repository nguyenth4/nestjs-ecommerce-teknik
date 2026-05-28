import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, actorId?: string) {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });
    if (actorId) {
      await this.prisma.auditLog.create({
        data: {
          actorId,
          action: 'CREATE_PRODUCT',
          entityType: 'Product',
          entityId: product.id,
          metadata: createProductDto as any,
        }
      });
    }
    return product;
  }

  async findAll() {
    return this.prisma.product.findMany();
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto, actorId?: string) {
    const product = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
    if (actorId) {
      await this.prisma.auditLog.create({
        data: {
          actorId,
          action: 'UPDATE_PRODUCT',
          entityType: 'Product',
          entityId: product.id,
          metadata: updateProductDto as any,
        }
      });
    }
    return product;
  }

  async remove(id: string, actorId?: string) {
    const product = await this.prisma.product.delete({
      where: { id },
    });
    if (actorId) {
      await this.prisma.auditLog.create({
        data: {
          actorId,
          action: 'DELETE_PRODUCT',
          entityType: 'Product',
          entityId: product.id,
          metadata: product as any,
        }
      });
    }
    return product;
  }
}
