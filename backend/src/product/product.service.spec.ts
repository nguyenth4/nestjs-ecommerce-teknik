import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', () => {
    const dto = { name: 'Test Product', sku: 'TEST-1', price: 1000, categoryId: 'cat-1' };
    const product = service.create(dto);
    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Test Product');
  });

  it('should find all products', () => {
    service.create({ name: 'Product 1', sku: 'SKU-1', price: 100, categoryId: '1' });
    const products = service.findAll();
    expect(products.length).toBe(1);
  });

  it('should find one product by id', () => {
    const created = service.create({ name: 'Product 2', sku: 'SKU-2', price: 200, categoryId: '1' });
    const found = service.findOne(created.id);
    expect(found).toBeDefined();
    expect(found.id).toBe(created.id);
  });

  it('should return null if product not found', () => {
    const found = service.findOne('non-existent-id');
    expect(found).toBeNull();
  });

  it('should update a product', () => {
    const created = service.create({ name: 'Old Name', sku: 'SKU-3', price: 300, categoryId: '1' });
    const updated = service.update(created.id, { name: 'New Name' });
    expect(updated).toBeDefined();
    expect(updated?.name).toBe('New Name');
  });

  it('should delete a product', () => {
    const created = service.create({ name: 'To Delete', sku: 'SKU-4', price: 400, categoryId: '1' });
    const deleted = service.remove(created.id);
    expect(deleted).toBeDefined();
    
    const found = service.findOne(created.id);
    expect(found).toBeNull();
  });
});
