import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserSignUpResponseDto } from '../auth/dtos/user.singup-response.dto';
import bcrypt from 'bcryptjs';
import { UserSignInDto } from '../auth/dtos/user.singin.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: userWhereUniqueInput,
    });

    return user;
  }

  async createUser(
    newUser: Prisma.UserCreateInput,
  ): Promise<UserSignUpResponseDto> {
    const isUserExist = await this.user({ email: newUser.email });

    if (isUserExist) {
      throw new ConflictException('Wrong credentials.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newUser.password, salt);
    newUser.password = passwordHash;
    const user = await this.prisma.user.create({
      data: newUser,
    });
    const token = await this.jwtService.signAsync({ id: user.id });
    return { userId: user.id, token };
  }

  async signIn(userData: UserSignInDto): Promise<UserSignUpResponseDto> {
    const user = await this.user({ email: userData.email });

    if (!user) throw new NotFoundException('Wrong credentials');

    const passwordMatches = await bcrypt.compare(
      userData.password,
      user.password,
    );

    if (passwordMatches) {
      const token = await this.jwtService.signAsync({ id: user.id });
      return { userId: user.id, token };
    }
    throw new NotFoundException('Wrong credentials');
  }
}
