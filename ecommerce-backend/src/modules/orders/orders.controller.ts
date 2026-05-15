import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('orders')
@ApiBearerAuth('access-token')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(
    @CurrentUser() user: { id: string },
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    const key = idempotencyKey?.trim() || undefined;
    return this.ordersService.checkout(user.id, key);
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
    @CurrentUser() user: { id: string; role?: { name: string } },
  ) {
    const role = user.role?.name ?? '';
    return this.ordersService.updateStatusForAdmin(id, dto, role, user.id);
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
