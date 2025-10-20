import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './user.service';
import { RecipesService } from './recipe.service';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './common/constants';
import { PrismaService } from './prisma.service';
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
  ],
  controllers: [AppController],
  providers: [AppService, UsersService, RecipesService, PrismaService],
})
export class AppModule {}
