/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIngredientDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  metricId: number;

  @IsOptional()
  quantity?: number;
}
