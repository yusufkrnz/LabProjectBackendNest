import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GithubQlService } from './github-ql.service';
import { GithubQlController } from './github-ql.controller';
import { RepositoryAnalyzer } from './repository-analyzer.service';
import { GithubRepository, GithubRepositorySchema } from '../schemas/github-repository.schema';
import { UserGithubScan, UserGithubScanSchema } from '../schemas/user-github-scan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GithubRepository.name, schema: GithubRepositorySchema },
      { name: UserGithubScan.name, schema: UserGithubScanSchema }
    ])
  ],
  providers: [GithubQlService, RepositoryAnalyzer],
  controllers: [GithubQlController],
  exports: [GithubQlService]
})
export class GithubQlModule { }
