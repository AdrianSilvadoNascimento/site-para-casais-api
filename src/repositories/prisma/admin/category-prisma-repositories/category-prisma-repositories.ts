import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../../../../database/prisma.service";
import { CategoryEntity } from "../../../../entity/category.entity";
import { CategoryModel } from "src/dtos/category-model";

@Injectable()
export class CategoryPrismaRepositories {
  constructor(private prisma: PrismaService) {}

  async getCategories(userId: string): Promise<CategoryEntity[]> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        }
      })

      if (!user) {
        throw new NotFoundException('Não foi possível encontrar o estabelecimento')
      } else {
        return await this.prisma.category.findMany({
          where: {
            user_id: userId,
          },
        })
      }
    } catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }

  async registerCategory(userId: string, categoryData: CategoryModel): Promise<CategoryEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!user) {
        throw new NotFoundException('Não foi possível encontrar o estabelecimento')
      } else {
        return await this.prisma.category.create({
          data: {
            name: categoryData.name,
            value: categoryData.value,
            user_id: userId,
            created_at: new Date().toISOString(),
          },
        })
      }
    } catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }

  async deleteCategory(categoryId: string): Promise<CategoryEntity> {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      })

      if (!category) {
        throw new NotFoundException('Não foi possível encontrar a categoria com o ID: ' + categoryId)
      } else {
        return await this.prisma.category.delete({
          where: {
            id: categoryId,
          },
        })
      }
    } catch (error) {
      console.error(error)
      throw new Error(error)
    }
  }
}
