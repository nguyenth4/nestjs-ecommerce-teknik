import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async findAllAdmin() {
    return this.prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: 'desc' },
      omit: { passwordHash: true },
    });
  }

  async updateStatus(id: string, status: 'active' | 'inactive' | 'blocked') {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.user.update({
      where: { id },
      data: { status },
      include: { role: true },
      omit: { passwordHash: true },
    });
  }

  async updateRole(id: string, roleId: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');
    return this.prisma.user.update({
      where: { id },
      data: { roleId },
      include: { role: true },
      omit: { passwordHash: true },
    });
  }

  async findAllRoles() {
    return this.prisma.role.findMany({ orderBy: { name: 'asc' } });
  }
}

