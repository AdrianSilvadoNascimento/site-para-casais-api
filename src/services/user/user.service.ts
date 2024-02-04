import { Injectable } from '@nestjs/common';

import { UserRepository } from '../../repositories/user-respositories';
import { EmployeeEntity } from '../../entity/employee.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createEmployee(
    name: string,
    email: string,
    lastname: string,
    password: string,
    type: number,
    employerEmail: string
  ): Promise<any> {
    return await this.userRepository.createEmployee(
      name,
      email,
      lastname,
      password,
      type,
      employerEmail
    );
  }

  async loginUser(email: string, password: string): Promise<any> {
    return await this.userRepository.loginUser(email, password);
  }

  async createUser(newUserModel: {
    name: string;
    email: string;
    password: string;
    type: number;
    expiration_trial: Date;
  }): Promise<any> {
    return await this.userRepository.createUser(newUserModel);
  }

  async checkUser(userId: string): Promise<boolean> {
    return this.userRepository.checkUser(userId);
  }

  async getAccountInfo(userId: string): Promise<EmployeeEntity> {
    return await this.userRepository.getAccountInfo(userId);
  }
}
