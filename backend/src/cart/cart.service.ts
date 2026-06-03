import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
    }

    return cart;
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    const cart = await this.getCart(userId);

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: { inventory: true },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Sản phẩm không tồn tại hoặc không hoạt động');
    }

    // Kiểm tra tồn kho
    const availableStock = product.inventory ? (product.inventory.quantity - product.inventory.reservedQuantity) : 0;
    if (availableStock < dto.quantity) {
      throw new BadRequestException('Sản phẩm không đủ số lượng trong kho');
    }

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: dto.productId,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;
      if (availableStock < newQuantity) {
        throw new BadRequestException('Sản phẩm không đủ số lượng trong kho');
      }
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity,
        price: product.price, // lưu giá tại thời điểm thêm
      },
    });
  }

  async updateCartItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.getCart(userId);

    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      include: { product: { include: { inventory: true } } },
    });

    if (!item) {
      throw new NotFoundException('Sản phẩm không có trong giỏ hàng');
    }

    const availableStock = item.product.inventory ? (item.product.inventory.quantity - item.product.inventory.reservedQuantity) : 0;
    if (availableStock < dto.quantity) {
      throw new BadRequestException('Sản phẩm không đủ số lượng trong kho');
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });
  }

  async removeCartItem(userId: string, itemId: string) {
    const cart = await this.getCart(userId);

    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!item) {
      throw new NotFoundException('Sản phẩm không có trong giỏ hàng');
    }

    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }
}
