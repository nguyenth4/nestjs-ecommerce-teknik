import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';

const cartInclude = {
  items: {
    include: {
      product: { include: { category: true, inventory: true } },
    },
    orderBy: { createdAt: 'asc' as const },
  },
};

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }
    return cart;
  }

  async getCart(userId: string) {
    await this.getOrCreateCart(userId);
    return this.prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: { inventory: true },
    });
    if (!product || product.status !== 'active') {
      throw new NotFoundException('Product not found or unavailable');
    }
    if (!product.price || product.price <= 0) {
      throw new BadRequestException('Product is out of stock');
    }
    if (product.inventory && product.inventory.quantity < dto.quantity) {
      throw new BadRequestException('Not enough stock for this product');
    }

    const cart = await this.getOrCreateCart(userId);
    const existing = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: dto.productId },
    });

    const nextQty = (existing?.quantity ?? 0) + dto.quantity;
    if (product.inventory && product.inventory.quantity < nextQty) {
      throw new BadRequestException('Not enough stock for this product');
    }

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: nextQty },
        include: { product: { include: { category: true, inventory: true } } },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity,
      },
      include: { product: { include: { category: true, inventory: true } } },
    });
  }

  async updateItemQuantity(userId: string, itemId: string, quantity: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: { include: { inventory: true } },
      },
    });
    if (!item || item.cart.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }
    if (!item.product.price || item.product.price <= 0) {
      throw new BadRequestException('Product is out of stock');
    }
    if (item.product.inventory && item.product.inventory.quantity < quantity) {
      throw new BadRequestException('Not enough stock for this product');
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: { include: { category: true, inventory: true } } },
    });
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });
    if (!item || item.cart.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }
    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return { ok: true };
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { ok: true };
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return { ok: true };
  }
}
