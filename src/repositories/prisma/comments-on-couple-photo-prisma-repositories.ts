/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { CommentsOnCouplePhotoEntity } from 'src/entity/comments-on-couple-photo.entity';
import { CommentsOnCouplePhotoModel } from 'src/dtos/comments-on-couple-photo-model';
import { CommentsOnCouplePhotoRepository } from '../comments-on-couple-photo-repositories';

@Injectable()
export class CommentsOnCouplePhotoPrismaRepository implements CommentsOnCouplePhotoRepository {
  constructor(private prisma: PrismaService) {}

  async createComment(comment: CommentsOnCouplePhotoModel, userId: string): Promise<CommentsOnCouplePhotoEntity> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) throw new NotFoundException('Usuário não encontrado')

      return await this.prisma.commentsOnCouplePhoto.create({
        data: {
          user_id: userId,
          message: comment.message,
          updated_at: new Date(),
        }
      })
    } catch (error) {
      throw new NotAcceptableException('Erro ao criar comentário');
    }
  }

  async getComments(userId: string): Promise<CommentsOnCouplePhotoEntity[]> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) throw new NotFoundException('Usuário não encontrado')

      return await this.prisma.commentsOnCouplePhoto.findMany({
        where: { user_id: userId }
      })
    } catch (error) {
      throw new NotAcceptableException('Erro ao buscar comentários');
    }
  }
}
