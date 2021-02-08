import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma/prisma.service';
import { UserResolver } from './user/user.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      context: ({ req }) => ({ headers: req.headers }),
      sortSchema: true,
    }),
  ],
  providers: [UserService, PrismaService, UserResolver],
})
export class AppModule {}
