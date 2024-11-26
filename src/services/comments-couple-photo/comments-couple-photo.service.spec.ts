import { Test, TestingModule } from '@nestjs/testing';
import { CommentsCouplePhotoService } from './comments-couple-photo.service';

describe('CommentsCouplePhotoService', () => {
  let service: CommentsCouplePhotoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentsCouplePhotoService],
    }).compile();

    service = module.get<CommentsCouplePhotoService>(CommentsCouplePhotoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
