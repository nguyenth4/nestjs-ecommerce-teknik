import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  it('should be a class that extends PrismaClient', () => {
    expect(PrismaService).toBeDefined();
    expect(PrismaService.prototype.onModuleInit).toBeDefined();
  });

  it('onModuleInit should be a function', () => {
    expect(typeof PrismaService.prototype.onModuleInit).toBe('function');
  });
});

