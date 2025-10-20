/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, Prisma } from 'generated/prisma';
import bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { UserSignInDto } from './dto/user.singin.dto';
import { UserSignUpResponseDto } from './dto/user.singup-response.dto';
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
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(
    newUser: Prisma.UserCreateInput,
  ): Promise<UserSignUpResponseDto> {
    const isUserExist = await this.user({ email: newUser.email });

    if (isUserExist) {
      throw new ConflictException('Email is already taken');
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
      user.password,
      userData.password,
    );

    if (passwordMatches) {
      const token = await this.jwtService.signAsync({ id: user.id });
      return { userId: user.id, token };
    }
    throw new NotFoundException('Wrong credentials');
  }
}
