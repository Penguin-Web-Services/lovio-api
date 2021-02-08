import { Injectable, Scope, UseGuards } from '@nestjs/common';

import { Args, Context, Resolver, Query, Mutation } from '@nestjs/graphql';

//import { User } from '@generated/type-graphql/models';
import { UserService } from './user.service';
//import { MyContext } from './auth.checker';
import { IMutation, IQuery, User } from '../graphql.schema';
import { AuthUser } from '../lib/auth.checker';

@Injectable({ scope: Scope.REQUEST })
@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {
    //super();
  }

  @Query()
  me(@AuthUser() user): Promise<IQuery['me']> {
    return this.userService.user(user.id);
  }

  @Query((returns) => User)
  user(@Args('id') id: number) {
    return this.userService.user(id);
  }

  @Mutation(() => String)
  login(@Args('data') data) {
    return this.userService.login(data);
  }

  @Mutation()
  register(@Args('data') data) {
    return this.userService.register(data);
  }
}
