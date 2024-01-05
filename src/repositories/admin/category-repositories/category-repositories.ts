import { CategoryModel } from "src/dtos/category-model";
import { CategoryEntity } from "../../../entity/category.entity";

export abstract class CategoryRepository {
  abstract getCategories(userId: string): Promise<CategoryEntity[]>
  abstract registerCategory(userId: string, categoryData: CategoryModel): Promise<CategoryEntity>
  abstract deleteCategory(categoryId: string): Promise<CategoryEntity>
}
