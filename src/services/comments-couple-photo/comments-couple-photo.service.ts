import { Injectable } from '@nestjs/common';
import { CommentsOnCouplePhotoRepository } from '../../repositories/comments-on-couple-photo-repositories';
import { CommentsOnCouplePhotoModel } from 'src/dtos/comments-on-couple-photo-model';
import { CommentsOnCouplePhotoEntity } from 'src/entity/comments-on-couple-photo.entity';

@Injectable()
export class CommentsCouplePhotoService {
  constructor(
    private readonly commentsOnCouplePhotoRepository: CommentsOnCouplePhotoRepository
  ) {}

  async createComment(
    comment: CommentsOnCouplePhotoModel,
    userId: string
  ): Promise<CommentsOnCouplePhotoEntity> {
    return await this.commentsOnCouplePhotoRepository.createComment(
      comment,
      userId
    );
  }

  async getComments(userId: string): Promise<CommentsOnCouplePhotoEntity[]> {
    return await this.commentsOnCouplePhotoRepository.getComments(userId);
  }
}
