import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a category', () => {
    const dto = { name: 'Test Category', slug: 'test-category', isActive: true };
    const category = service.create(dto);
    expect(category).toHaveProperty('id');
    expect(category.name).toBe('Test Category');
  });

  it('should find all categories', () => {
    service.create({ name: 'Category 1', slug: 'cat-1' });
    const categories = service.findAll();
    expect(categories.length).toBe(1);
  });

  it('should find one category by id', () => {
    const created = service.create({ name: 'Category 2', slug: 'cat-2' });
    const found = service.findOne(created.id);
    expect(found).toBeDefined();
    expect(found.id).toBe(created.id);
  });

  it('should return null if category not found', () => {
    const found = service.findOne('non-existent-id');
    expect(found).toBeNull();
  });

  it('should update a category', () => {
    const created = service.create({ name: 'Old Name', slug: 'old-name' });
    const updated = service.update(created.id, { name: 'New Name' });
    expect(updated).toBeDefined();
    expect(updated?.name).toBe('New Name');
  });

  it('should delete a category', () => {
    const created = service.create({ name: 'To Delete', slug: 'to-delete' });
    const deleted = service.remove(created.id);
    expect(deleted).toBeDefined();
    
    const found = service.findOne(created.id);
    expect(found).toBeNull();
  });
});
