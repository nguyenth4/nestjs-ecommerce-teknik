import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }
}
