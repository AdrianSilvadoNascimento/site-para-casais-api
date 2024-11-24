import { Injectable } from '@nestjs/common';

import { UserRepository } from '../../repositories/user-respositories';
import { UserEntity } from '../../entity/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async loginUser(email: string, password: string): Promise<any> {
    return await this.userRepository.loginUser(email, password);
  }

  async createUser(newUserModel: UserEntity): Promise<UserEntity> {
    return await this.userRepository.createUser(newUserModel);
  }

  async updateUser(userData: {
    user: UserEntity;
    userId: string;
  }): Promise<any> {
    return await this.userRepository.updateUser(userData);
  }

  async checkUser(userId: string): Promise<boolean> {
    return this.userRepository.checkUser(userId);
  }

  async getAccountInfo(userId: string): Promise<UserEntity> {
    return await this.userRepository.getAccountInfo(userId);
  }
}
