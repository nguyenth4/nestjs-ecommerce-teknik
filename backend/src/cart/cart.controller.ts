import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Lấy thông tin giỏ hàng của user hiện tại' })
  @Get()
  getCart(@CurrentUser() user: any) {
    return this.cartService.getCart(user.userId);
  }

  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng' })
  @Post('items')
  addToCart(@CurrentUser() user: any, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(user.userId, dto);
  }

  @ApiOperation({ summary: 'Cập nhật số lượng sản phẩm trong giỏ' })
  @Put('items/:id')
  updateCartItem(
    @CurrentUser() user: any,
    @Param('id') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(user.userId, itemId, dto);
  }

  @ApiOperation({ summary: 'Xóa sản phẩm khỏi giỏ hàng' })
  @Delete('items/:id')
  removeCartItem(@CurrentUser() user: any, @Param('id') itemId: string) {
    return this.cartService.removeCartItem(user.userId, itemId);
  }
}
