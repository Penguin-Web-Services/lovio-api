import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('register')
  async register(
    @Body() data: { email: string; pw: string },
  ): Promise<UserModel> {
    return this.userService.register(data);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() data: { email: string; pw: string }): Promise<UserModel> {
    return this.userService.login(data);
  }
}
