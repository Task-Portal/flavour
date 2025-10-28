import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserCreateDto } from 'src/dto/user.create.dto';
import { UserSignInDto } from 'src/modules/auth/dtos/user.singin.dto';
import { UserSignUpResponseDto } from 'src/modules/auth/dtos/user.singup-response.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}
  @Post('user')
  async signupUser(
    @Body() userData: UserCreateDto,
  ): Promise<UserSignUpResponseDto> {
    return await this.usersService.createUser(userData);
  }

  @Get('user')
  async signinUser(
    @Body() userData: UserSignInDto,
  ): Promise<UserSignUpResponseDto> {
    return await this.usersService.signIn(userData);
  }
}
