import { Test, TestingModule } from '@nestjs/testing';
import { GithubQlController } from './github-ql.controller';

describe('GithubQlController', () => {
  let controller: GithubQlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GithubQlController],
    }).compile();

    controller = module.get<GithubQlController>(GithubQlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
