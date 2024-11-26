import { IsNotEmpty } from 'class-validator';

export class CommentsOnCouplePhotoModel {
  @IsNotEmpty()
  message: string;

  created_at: Date;
  updated_at: Date;
}
