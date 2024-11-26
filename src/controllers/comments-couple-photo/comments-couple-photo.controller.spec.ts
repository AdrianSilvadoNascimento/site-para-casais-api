import { Test, TestingModule } from '@nestjs/testing';
import { CommentsCouplePhotoController } from './comments-couple-photo.controller';

describe('CommentsCouplePhotoController', () => {
  let controller: CommentsCouplePhotoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsCouplePhotoController],
    }).compile();

    controller = module.get<CommentsCouplePhotoController>(CommentsCouplePhotoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
