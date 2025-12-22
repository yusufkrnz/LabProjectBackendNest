import { Test, TestingModule } from '@nestjs/testing';
import { GithubQlService } from './github-ql.service';

describe('GithubQlService', () => {
  let service: GithubQlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GithubQlService],
    }).compile();

    service = module.get<GithubQlService>(GithubQlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
