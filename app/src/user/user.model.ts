import { InputType, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id: number;
  @Field()
  email: string;
  @Field()
  pw: string;
  @Field()
  name: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;
  @Field()
  pw: string;
}

@InputType()
export class RegisterInput {
  @Field()
  email: string;
  @Field()
  pw: string;
  @Field({ nullable: true })
  name?: string;
}
