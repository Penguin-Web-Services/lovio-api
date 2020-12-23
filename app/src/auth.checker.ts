import { AuthChecker } from 'type-graphql';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';

export class MyContext {
  headers: any;
  user: User;
}

export const authChecker: AuthChecker<MyContext> = async ({ context }) => {
  if (!context.headers.authorization) {
    return false;
  }

  context.user = await validateToken(context.headers.authorization);

  return true;
};

async function validateToken(auth: string) {
  const authArr = auth.split(' ');
  if (authArr[0] !== 'Bearer') {
    throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
  }

  const token = authArr[1];

  try {
    return await jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
  }
}
