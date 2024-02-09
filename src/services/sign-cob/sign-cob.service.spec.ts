import { Test, TestingModule } from '@nestjs/testing';
import { SignCobService } from './sign-cob.service';

describe('SignCobService', () => {
  let service: SignCobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignCobService],
    }).compile();

    service = module.get<SignCobService>(SignCobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
