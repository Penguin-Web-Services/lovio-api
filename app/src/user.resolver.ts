import { Injectable, Scope, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  FieldResolver,
  Args,
  Int,
  Authorized,
  Ctx,
} from 'type-graphql';

import { Context } from '@nestjs/graphql';

import { User } from '@generated/type-graphql/models';
import { UserService } from './user.service';
import { AuthGuard } from './auth.guard';
import { MyContext } from './auth.checker';

@Injectable({ scope: Scope.REQUEST })
@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(new AuthGuard())
  @Authorized()
  me(@Ctx() context: MyContext): Promise<User> {
    return this.userService.user(context.user.id);
  }

  @Query((returns) => User)
  user(@Arg('id') id: number) {
    return this.userService.user(id);
  }

  @Mutation(() => String)
  login(@Arg('email') email: string, @Arg('pw') pw: string) {
    return this.userService.login({ email, pw });
  }

  @Mutation(() => String)
  test(
    @Arg('data', () => String)
    { email, pw }: { email: string; pw: string },
  ) {
    return this.userService.login({ email, pw });
  }
}
