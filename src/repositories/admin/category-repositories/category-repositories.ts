import { CategoryModel } from "../../../dtos/category-model";
import { CategoryEntity } from "../../../entity/category.entity";

export abstract class CategoryRepository {
  abstract getCategories(userId: string): Promise<CategoryEntity[]>
  abstract getCategory(categoryId: string): Promise<CategoryEntity>
  abstract registerCategory(userId: string, categoryData: CategoryModel): Promise<CategoryEntity>
  abstract updateCategory(categoryId: string, categoryData: CategoryModel): Promise<CategoryEntity>
  abstract deleteCategory(categoryId: string): Promise<CategoryEntity>
}
