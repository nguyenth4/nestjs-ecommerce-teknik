import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '@prisma/client';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('audit-log')
@Controller('audit-log')
export class AuditLogController {
  @ApiOperation({ summary: 'Xem lịch sử hệ thống' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.ADMIN)
  @Get()
  findAll() {
    return { message: 'Danh sách audit log (Chỉ Admin)' };
  }
}
