import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@CurrentUser() user: { id: string }) {
    return this.ordersService.checkout(user.id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'staff')
  @Get('admin/list')
  findAllAdmin() {
    return this.ordersService.findAllForAdmin();
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'staff')
  @Patch('admin/:id/status')
  updateStatusAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser() user: { role?: { name: string } },
  ) {
    const role = user.role?.name ?? '';
    return this.ordersService.updateStatusForAdmin(id, dto, role);
  }

  @Get()
  findMine(@CurrentUser() user: { id: string }) {
    return this.ordersService.findMine(user.id);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: { id: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.ordersService.findOneForUser(id, user.id);
  }
}
