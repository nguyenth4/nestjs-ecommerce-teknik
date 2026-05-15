import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  issueTokens(user: { id: string; email: string; role?: { name: string } }) {
    const accessTtl = (this.config.get<string>('JWT_EXPIRES_IN') || '1h') as string;
    const refreshTtl = (this.config.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d') as string;
    const access_token = this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role?.name },
      { expiresIn: accessTtl as any },
    );
    const refresh_token = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: refreshTtl as any },
    );
    return { access_token, refresh_token, token_type: 'Bearer' as const };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    return this.issueTokens(user);
  }

  async register(data: any) {
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(data.password, salt);

    let customerRole = await this.prisma.role.findUnique({ where: { name: 'customer' } });
    if (!customerRole) {
      customerRole = await this.prisma.role.create({
        data: { name: 'customer', description: 'Customer Role' },
      });
    }

    const newUser = await this.usersService.create({
      email: data.email,
      passwordHash,
      fullName: data.fullName,
      role: { connect: { id: customerRole.id } },
    });

    const full = await this.usersService.findById(newUser.id);
    if (!full) {
      throw new BadRequestException('Registration failed');
    }
    return this.issueTokens(full);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{ sub: string; type?: string }>(refreshToken, {
        secret: this.config.get<string>('JWT_SECRET') || 'super-secret-key',
      });
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      return this.issueTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
