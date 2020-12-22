import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, UserCreateInput } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

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

    return this.createJWT(user);
  }

  async user(id): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  createJWT({ id, email, name }: User) {
    return jwt.sign(
      {
        id,
        email,
        name,
      },
      process.env.JWT_SECRET,
    );
  }
}
