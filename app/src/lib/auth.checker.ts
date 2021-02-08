//import { AuthChecker } from 'type-graphql';
import * as jwt from 'jsonwebtoken';
import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GqlExecutionContext } from '@nestjs/graphql';

export class MyContext {
  headers: any;
  user: User;
}

export const AuthUser = createParamDecorator(
  (data: undefined, ctx: ExecutionContext) => {
    const { authorization } = GqlExecutionContext.create(
      ctx,
    ).getContext().headers;

    return validateToken(authorization);
  },
);

interface AuthTokenUser {
  id: number;
}

async function validateToken(auth: string): Promise<AuthTokenUser> {
  const [, bearerToken] = auth.split('Bearer ');
  if (!bearerToken) {
    throw new HttpException('Bearer Token Missing', HttpStatus.UNAUTHORIZED);
  }

  try {
    return await jwt.verify(bearerToken, process.env.JWT_SECRET);
  } catch (err) {
    throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
  }
}
