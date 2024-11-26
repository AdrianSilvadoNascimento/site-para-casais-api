import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import { UserModel } from '../../dtos/user-model';
import { UserService } from '../../services/user/user.service';
import { UserEntity } from '../../entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register-user')
  async createUser(@Body() body: UserModel): Promise<any> {
    const newUserModel: UserEntity = body;
    return await this.userService.createUser(newUserModel);
  }

  @Post('login-user')
  async loginUser(
    @Body() body: { email: string; password: string }
  ): Promise<any> {
    const { email, password } = body;
    return await this.userService.loginUser(email, password);
  }

  @Put('like-couple-photo/:id')
  async likeCouplePhoto(
    @Body() body: { isLiking: boolean },
    @Param('id') userId: string
  ): Promise<any> {
    return await this.userService.likeCouplePhoto(body.isLiking, userId);
  }

  @Put('update-user/:id')
  async updateUser(
    @Body() body: UserEntity,
    @Param('id') userId: string
  ): Promise<any> {
    const userData = { user: body as UserEntity, userId };
    return await this.userService.updateUser(userData);
  }

  @Get('get-user/:id')
  async getAccountInfo(@Param('id') userId: string): Promise<UserEntity> {
    return await this.userService.getAccountInfo(userId);
  }
}
