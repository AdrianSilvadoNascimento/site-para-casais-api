import { CommentsOnCouplePhotoEntity } from '../entity/comments-on-couple-photo.entity';
import { CommentsOnCouplePhotoModel } from '../dtos/comments-on-couple-photo-model';

export abstract class CommentsOnCouplePhotoRepository {
  abstract createComment(
    comment: CommentsOnCouplePhotoModel,
    userId: string
  ): Promise<CommentsOnCouplePhotoEntity>;

  abstract getComments(userId: string): Promise<CommentsOnCouplePhotoEntity[]>;
}
