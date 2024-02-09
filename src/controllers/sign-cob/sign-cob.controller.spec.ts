import { Test, TestingModule } from '@nestjs/testing';
import { SignCobController } from './sign-cob.controller';

describe('SignCobController', () => {
  let controller: SignCobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignCobController],
    }).compile();

    controller = module.get<SignCobController>(SignCobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
