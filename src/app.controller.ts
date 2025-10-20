/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { RecipesService } from './recipe.service';
import { Recipe as RecipeModel } from 'generated/prisma';

import type { UserCreateDto } from './dto/user.create.dto';
import { CreateRecipeDto } from './dto/create.recipe.dto';
import { UserSignUpResponseDto } from './dto/user.singup-response.dto';
import { UserSignInDto } from './dto/user.singin.dto';

import { AuthGuard } from './common/guards/jwt-auth.guard';

// interface RequestWithUserId extends Request {
//   userId: string;
// }
@Controller()
export class AppController {
  constructor(
    private readonly userService: UsersService,
    private readonly recipeService: RecipesService,
  ) {}

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

  @UseGuards(AuthGuard)
  @Post('recipe/')
  async create(
    @Request() req,
    newRecipe: CreateRecipeDto,
  ): Promise<RecipeModel> {
    return this.recipeService.createRecipe(req.userId, newRecipe);
  }

  @Post('user')
  async signupUser(
    @Body() userData: UserCreateDto,
  ): Promise<UserSignUpResponseDto> {
    return this.userService.createUser(userData);
  }

  @Get('user')
  async signinUser(
    @Body() userData: UserSignInDto,
  ): Promise<UserSignUpResponseDto> {
    return this.userService.signIn(userData);
  }
}
