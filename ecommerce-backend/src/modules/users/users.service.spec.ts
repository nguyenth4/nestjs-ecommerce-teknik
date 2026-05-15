import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
      update: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      const mockUser = { id: 'u1', email: 'test@test.com', role: { name: 'customer' } };
      prismaMock.user.findUnique.mockResolvedValueOnce(mockUser);
      const result = await service.findByEmail('test@test.com');
      expect(result).toEqual(mockUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
        include: { role: true },
      });
    });

    it('should return null when user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      const result = await service.findByEmail('none@test.com');
      expect(result).toBeNull();
    });
  });

  describe('findAllAdmin', () => {
    it('should return all users without passwordHash', async () => {
      const result = await service.findAllAdmin();
      expect(result).toEqual([]);
      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ omit: { passwordHash: true } }),
      );
    });
  });

  describe('findAllRoles', () => {
    it('should return all roles', async () => {
      const result = await service.findAllRoles();
      expect(result).toEqual([]);
      expect(prismaMock.role.findMany).toHaveBeenCalled();
    });
  });
});
