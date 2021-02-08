import { Injectable, Scope, UseGuards } from '@nestjs/common';

import { Args, Context, Resolver, Query, Mutation } from '@nestjs/graphql';

import { UserService } from './user.service';
import { AuthUser } from '../lib/auth.checker';
import { LoginInput, RegisterInput, User } from './user.model';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {
    //super();
  }

  @Query((returns) => User)
  me(@AuthUser() user) {
    return this.userService.user(user.id);
  }

  @Query((returns) => User)
  user(@Args('id') id: number) {
    return this.userService.user(id);
  }

  @Mutation(() => String)
  login(@Args('data') data: LoginInput) {
    return this.userService.login(data);
  }

  @Mutation((returns) => User)
  register(@Args('data') data: RegisterInput) {
    return this.userService.register(data);
  }
}
