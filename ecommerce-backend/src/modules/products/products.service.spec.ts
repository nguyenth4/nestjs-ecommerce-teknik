import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { REDIS } from '../../redis/redis.module';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../audit/audit-log.service';

describe('ProductsService', () => {
  let service: ProductsService;
  const redisMock = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
  };
  const prismaMock = {
    product: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    category: { findMany: jest.fn().mockResolvedValue([]) },
  };
  const auditLogMock = {
    log: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: REDIS, useValue: redisMock },
        { provide: AuditLogService, useValue: auditLogMock },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return products from DB when cache misses', async () => {
      redisMock.get.mockResolvedValueOnce(null);
      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(prismaMock.product.findMany).toHaveBeenCalled();
    });

    it('should return cached products when available', async () => {
      const cached = [{ id: 'p1', name: 'Cached' }];
      redisMock.get.mockResolvedValueOnce(JSON.stringify(cached));
      const result = await service.findAll();
      expect(result).toEqual(cached);
      expect(prismaMock.product.findMany).not.toHaveBeenCalled();
    });
  });
});
