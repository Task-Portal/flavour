import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [RecipeController],
  providers: [RecipeService],
  imports: [PrismaModule],
})
export class RecipeModule {}
