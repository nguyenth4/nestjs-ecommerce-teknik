import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

class UpdateStatusDto {
  status!: 'active' | 'inactive' | 'blocked';
}

class UpdateRoleDto {
  roleId!: string;
}

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('admin/list')
  @Roles('admin', 'staff')
  findAll() {
    return this.usersService.findAllAdmin();
  }

  @Get('admin/roles')
  @Roles('admin', 'staff')
  findRoles() {
    return this.usersService.findAllRoles();
  }

  @Patch('admin/:id/status')
  @Roles('admin')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateStatusDto,
  ) {
    return this.usersService.updateStatus(id, body.status);
  }

  @Patch('admin/:id/role')
  @Roles('admin')
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateRoleDto,
  ) {
    return this.usersService.updateRole(id, body.roleId);
  }
}
