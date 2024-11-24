import { IsNotEmpty } from 'class-validator';

export class UserModel {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  age: number;
  couple_image: string;
  couple_start: Date;
  affection_message: string;
  spouse_name: string;

  created_at: Date;
  updated_at: Date;
}
