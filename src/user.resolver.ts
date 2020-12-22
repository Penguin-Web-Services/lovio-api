import { Injectable, Scope } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  FieldResolver,
  Args,
  Int,
} from 'type-graphql';

import { User } from '@generated/type-graphql/models';
import { UserService } from './user.service';

@Injectable({ scope: Scope.REQUEST })
@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => User)
  user(@Arg('id') id: number) {
    return this.userService.user(id);
  }
}
