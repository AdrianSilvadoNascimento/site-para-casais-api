import { UserEntity } from '../entity/user.entity';

export abstract class UserRepository {
  abstract createUser(newUserModel: UserEntity): Promise<UserEntity>;

  abstract loginUser(email: string, password: string): Promise<any>;

  abstract updateUser(userData: {
    user: UserEntity;
    userId: string;
  }): Promise<any>;

  abstract checkUser(userId: string): Promise<boolean>;

  abstract getAccountInfo(userId: string): Promise<UserEntity>;
}
