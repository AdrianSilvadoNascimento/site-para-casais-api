import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'

import { CategoryEntity } from '../../../entity/category.entity'
import { CategoryService } from '../../../services/admin/category/category.service'
import { CategoryModel } from '../../../dtos/category-model'

@Controller('admin/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get('get-categories/:id')
  async getCategories(@Param('id') userId: string): Promise<CategoryEntity[]> {
    return await this.categoryService.getCategories(userId)
  }

  @Get('get-category/:id')
  async getCategory(@Param('id') categoryId: string): Promise<CategoryEntity> {
    return await this.categoryService.getCategory(categoryId)
  }

  @Post('register-category/:id')
  async registerCategory(@Param('id') userId: string, @Body() categoryData: CategoryModel): Promise<CategoryEntity> {
    return await this.categoryService.registerCategory(userId, categoryData)
  }

  @Put('update-category/:id')
  async updateCategory(@Param('id') categoryId: string, @Body() categoryData: CategoryModel): Promise<CategoryEntity> {
    return await this.categoryService.updateCategory(categoryId, categoryData)
  }

  @Delete('delete-category/:id')
  async deleteCategory(@Param('id') categoryId: string): Promise<CategoryEntity> {
    return await this.categoryService.deleteCategory(categoryId)
  }
}
