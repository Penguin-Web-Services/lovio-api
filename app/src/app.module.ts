import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user.service';
import { PrismaService } from './prisma.service';
import { TypeGraphQLModule } from 'typegraphql-nestjs';
import { UserResolver } from './user.resolver';
import { authChecker } from './auth.checker';

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      emitSchemaFile: true,
      validate: false,
      dateScalarMode: 'timestamp',
      context: ({ req }) => ({ headers: req.headers }),
      authChecker,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UserService, PrismaService, UserResolver],
})
export class AppModule {}

