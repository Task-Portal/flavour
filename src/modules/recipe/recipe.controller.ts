import {
  Controller,
  Get,
  Param,
  // Post,
  // UseGuards,
  Request,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
// import { AuthGuard } from '@nestjs/passport';
// import { CreateRecipeDto } from 'src/dto/create.recipe.dto';
import { Recipe as RecipeModel } from '@prisma/client/';

// interface RequestWithUserId extends Request {
//   userId: string;
// }

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get('recipe/:id')
  async getRecipeById(@Param('id') id: string): Promise<RecipeModel | null> {
    return this.recipeService.recipe({ id: Number(id) });
  }

  @Get('filtered-recipes/:searchString')
  async getFilteredRecipes(
    @Param('searchString') searchString: string,
  ): Promise<RecipeModel[]> {
    return this.recipeService.recipes({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            content: { contains: searchString },
          },
        ],
      },
    });
  }

  // @UseGuards(AuthGuard)
  // @Post('recipe/')
  // async create(
  //   @Request() req: RequestWithUserId,
  //   newRecipe: CreateRecipeDto,
  // ): Promise<RecipeModel> {
  //   return this.recipeService.createRecipe(req.userId, newRecipe);
  // }
}
