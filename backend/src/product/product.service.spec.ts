import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;

  const mockPrismaService = {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    inventory: {
      create: jest.fn(),
    }
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should query db and return products', async () => {
      mockPrismaService.product.findMany.mockResolvedValue(['db_product']);
      
      const result = await service.findAll();
      expect(result).toEqual(['db_product']);
      expect(mockPrismaService.product.findMany).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create product and invalidate cache', async () => {
      mockPrismaService.product.create.mockResolvedValue({ id: '1', name: 'product_1' });
      const createDto = { name: 'product_1', sku: 'SKU1', price: 100, status: 'ACTIVE', categoryId: 'cat_1' };
      
      const result = await service.create(createDto);
      expect(result).toEqual({ id: '1', name: 'product_1' });
      expect(mockPrismaService.product.create).toHaveBeenCalledWith({ data: createDto });
      expect(mockCacheManager.del).toHaveBeenCalledWith('products_list');
    });
  });
});
