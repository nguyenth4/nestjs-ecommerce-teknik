import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '@prisma/client';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('user')
export class UserController {
  @ApiOperation({ summary: 'Quản lý người dùng' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.ADMIN)
  @Get()
  findAll() {
    return { message: 'Danh sách người dùng (Chỉ Admin)' };
  }
}
