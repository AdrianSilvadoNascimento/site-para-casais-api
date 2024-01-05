import { Injectable } from '@nestjs/common';

import { CategoryEntity } from '../../../entity/category.entity';
import { CategoryRepository } from '../../../repositories/admin/category-repositories/category-repositories';
import { CategoryModel } from '../../../dtos/category-model';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getCategories(userId: string): Promise<CategoryEntity[]> {
    return this.categoryRepository.getCategories(userId)
  }

  async registerCategory(userId: string, categoryData: CategoryModel): Promise<CategoryEntity> {
    return this.categoryRepository.registerCategory(userId, categoryData)
  }

  async deleteCategory(categoryId: string): Promise<CategoryEntity> {
    return this.categoryRepository.deleteCategory(categoryId)
  }
}
