import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  private categories: any[] = [];

  create(createCategoryDto: CreateCategoryDto) {
    const newCategory = { id: Date.now().toString(), ...createCategoryDto };
    this.categories.push(newCategory);
    return newCategory;
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const categoryIndex = this.categories.findIndex(c => c.id === id);
    if (categoryIndex > -1) {
      this.categories[categoryIndex] = { ...this.categories[categoryIndex], ...updateCategoryDto };
      return this.categories[categoryIndex];
    }
    return null;
  }

  findAll() {
    return this.categories;
  }

  findOne(id: string) {
    return this.categories.find(c => c.id === id) || null;
  }

  remove(id: string) {
    const categoryIndex = this.categories.findIndex(c => c.id === id);
    if (categoryIndex > -1) {
      const deletedCategory = this.categories[categoryIndex];
      this.categories.splice(categoryIndex, 1);
      return deletedCategory;
    }
    return null;
  }
}
