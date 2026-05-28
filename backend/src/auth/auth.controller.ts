import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { RoleName } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Đăng nhập' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Làm mới token' })
  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Thiếu refresh_token');
    }
    return this.authService.refreshToken(refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    // req.user được trích xuất từ JwtStrategy
    return req.user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.ADMIN)
  @Get('admin-only')
  getAdminData() {
    return { message: 'Chào mừng Admin, bạn có quyền truy cập dữ liệu này.' };
  }
}
