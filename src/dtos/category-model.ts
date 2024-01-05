import { IsNotEmpty } from 'class-validator';

export class CategoryModel {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  value: string;

  created_at: Date;
  updated_at?: Date;
}
