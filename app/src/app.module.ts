import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma/prisma.service';
import { UserResolver } from './user/user.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        emitTypenameField: true,
        outputAs: 'class',
      },
      context: ({ req }) => ({ headers: req.headers }),
    }),
  ],
  providers: [UserService, PrismaService, UserResolver],
})
export class AppModule {}
