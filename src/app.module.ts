/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';

import { AppController } from './app.controller';
import { UserService } from './services/user/user.service';
import { UserController } from './controllers/user/user.controller';
import { UserRepository } from './repositories/user-respositories';
import { UserPrismaRepository } from './repositories/prisma/user-prisma-repositories';
import { NotFoundExceptionFilter } from './custom-errors/not-found-exception-filter/not-found-exception-filter';
import { AuthMiddleware } from './utils/auth-middleware/auth-middleware';
import { CommentsCouplePhotoController } from './controllers/comments-couple-photo/comments-couple-photo.controller';
import { CommentsCouplePhotoService } from './services/comments-couple-photo/comments-couple-photo.service';
import { CommentsOnCouplePhotoRepository } from './repositories/comments-on-couple-photo-repositories';
import { CommentsOnCouplePhotoPrismaRepository } from './repositories/prisma/comments-on-couple-photo-prisma-repositories';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [
    AppController,
    UserController,
    CommentsCouplePhotoController,
  ],
  providers: [
    AppService,
    PrismaService,
    UserService,
    CommentsCouplePhotoService,
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
    {
      provide: CommentsOnCouplePhotoRepository,
      useClass: CommentsOnCouplePhotoPrismaRepository,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      'user/update-user',
    );
  }
}
