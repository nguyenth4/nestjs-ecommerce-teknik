import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  private products: any[] = [];

  create(createProductDto: CreateProductDto) {
    const newProduct = { id: Date.now().toString(), ...createProductDto };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex > -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...updateProductDto };
      return this.products[productIndex];
    }
    return null;
  }

  findAll() {
    return this.products;
  }

  findOne(id: string) {
    return this.products.find(p => p.id === id) || null;
  }

  remove(id: string) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex > -1) {
      const deletedProduct = this.products[productIndex];
      this.products.splice(productIndex, 1);
      return deletedProduct;
    }
    return null;
  }
}
