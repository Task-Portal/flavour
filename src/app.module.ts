import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { ConfigModule } from '@nestjs/config';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './common/constants';
import { PrismaService } from './prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RecipeModule } from './modules/recipe/recipe.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10h' },
    }),
    AuthModule,
    UsersModule,
    RecipeModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
