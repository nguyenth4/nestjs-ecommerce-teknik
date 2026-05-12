import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
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
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role?.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: any) {
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(data.password, salt);

    // In a real app, you should fetch the correct roleId instead of hardcoding or assuming
    // Here we find a default customer role or create one if it doesn't exist
    let customerRole = await this.prisma.role.findUnique({ where: { name: 'customer' } });
    if (!customerRole) {
      customerRole = await this.prisma.role.create({ data: { name: 'customer', description: 'Customer Role' } });
    }

    const newUser = await this.usersService.create({
      email: data.email,
      passwordHash,
      fullName: data.fullName,
      role: { connect: { id: customerRole.id } },
    });

    return this.login(newUser);
  }
}
