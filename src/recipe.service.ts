import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Recipe, Prisma } from 'generated/prisma';
import { CreateRecipeDto } from './dto/create.recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async recipe(
    recipeWhereUniqueInput: Prisma.RecipeWhereUniqueInput,
  ): Promise<Recipe | null> {
    return this.prisma.recipe.findUnique({
      where: recipeWhereUniqueInput,
    });
  }

  async recipes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RecipeWhereUniqueInput;
    where?: Prisma.RecipeWhereInput;
    orderBy?: Prisma.RecipeOrderByWithRelationInput;
  }): Promise<Recipe[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.recipe.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createRecipe(userId: number, dto: CreateRecipeDto): Promise<Recipe> {
    return this.prisma.$transaction(async (tx) => {
      const metricIds: number[] = [];
      for (const ing of dto.ingredients) {
        let metric = await tx.metric.findUnique({
          where: { id: ing.metricId },
        });

        if (!metric) {
          metric = await tx.metric.create({
            data: { id: ing.metricId, name: ing.name },
          });
        }
        metricIds.push(metric.id);
      }

      const recipe = await tx.recipe.create({
        data: {
          title: dto.title,
          content: dto.content,
          authorId: userId,
        },
      });

      for (const ing of dto.ingredients) {
        await tx.ingredient.create({
          data: {
            name: ing.name,
            quantity: ing.quantity || 0,
            metricId: ing.metricId,
            recipeId: recipe.id,
          },
        });
      }

      return recipe;
    });
  }

  async updateRecipe(params: {
    where: Prisma.RecipeWhereUniqueInput;
    data: Prisma.RecipeUpdateInput;
  }): Promise<Recipe> {
    const { data, where } = params;
    return this.prisma.recipe.update({
      data,
      where,
    });
  }

  async deleteRecipe(where: Prisma.RecipeWhereUniqueInput): Promise<Recipe> {
    return this.prisma.recipe.delete({
      where,
    });
  }
}
