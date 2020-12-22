import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  UserUpdateInput,
  User,
  UserCreateInput,
  UserWhereUniqueInput,
  UserWhereInput,
  UserOrderByInput,
} from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  register(data: UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async login({ email, pw }: { email: string; pw: string }): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new Error('Invalid Auth');

    if (user.pw !== pw) throw new Error('Invalid Auth');

    return user;
  }
}
