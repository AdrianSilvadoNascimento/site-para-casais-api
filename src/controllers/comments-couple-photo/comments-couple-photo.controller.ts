import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsOnCouplePhotoModel } from '../../dtos/comments-on-couple-photo-model';
import { CommentsOnCouplePhotoEntity } from '../../entity/comments-on-couple-photo.entity';
import { CommentsCouplePhotoService } from '../../services/comments-couple-photo/comments-couple-photo.service';

@Controller('comments-couple-photo')
export class CommentsCouplePhotoController {
  constructor(private commentService: CommentsCouplePhotoService) {}

  @Post('create-comment-on-couple-photo/:id')
  async createCommentOnCouplePhoto(
    @Param('id') userId: string,
    @Body() body: CommentsOnCouplePhotoModel
  ): Promise<CommentsOnCouplePhotoEntity> {
    return await this.commentService.createComment(body, userId);
  }

  @Get('get-comments-on-couple-photo/:id')
  async getCommentsOnCouplePhoto(
    @Param('id') userId: string
  ): Promise<CommentsOnCouplePhotoEntity[]> {
    return await this.commentService.getComments(userId);
  }
}
