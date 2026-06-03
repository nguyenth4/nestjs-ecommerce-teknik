import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '@prisma/client';

@ApiTags('order')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Tạo đơn hàng mới từ giỏ hàng' })
  @Post()
  createOrder(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(user.userId, dto);
  }

  @ApiOperation({ summary: 'Lấy danh sách đơn hàng của người dùng' })
  @Get()
  getUserOrders(@CurrentUser() user: any) {
    return this.orderService.getUserOrders(user.userId);
  }

  @ApiOperation({ summary: 'Admin cập nhật trạng thái đơn hàng' })
  @UseGuards(RolesGuard)
  @Roles(RoleName.ADMIN, RoleName.MANAGER)
  @Patch(':id/status')
  updateOrderStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateOrderStatus(id, dto.status);
  }
}
