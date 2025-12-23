import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GithubQlService } from './github-ql.service';
import { GithubQlController } from './github-ql.controller';
import { RepositoryAnalyzer } from './repository-analyzer.service';
import { TechStackMatcherService } from './tech-stack-matcher.service';
import { TechStackExtractorService } from './tech-stack-extractor.service';
import {
  GithubRepository,
  GithubRepositorySchema,
} from '../schemas/github-repository.schema';
import {
  UserGithubScan,
  UserGithubScanSchema,
} from '../schemas/user-github-scan.schema';

// Import parsers
import {
  PackageJsonParser,
  RequirementsTxtParser,
  GoModParser,
  GemfileParser,
  JavaDependencyParser,
} from './parsers/dependency-parsers';

// Import analyzers
import {
  FrameworkConfigAnalyzer,
  ORMSchemaAnalyzer,
  DevOpsAnalyzer,
  ReadmeAnalyzer,
} from './parsers/config-analyzers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GithubRepository.name, schema: GithubRepositorySchema },
      { name: UserGithubScan.name, schema: UserGithubScanSchema },
    ]),
  ],
  providers: [
    GithubQlService,
    RepositoryAnalyzer,
    TechStackMatcherService,
    TechStackExtractorService,
    // Dependency Parsers
    PackageJsonParser,
    RequirementsTxtParser,
    GoModParser,
    GemfileParser,
    JavaDependencyParser,
    // Config Analyzers
    FrameworkConfigAnalyzer,
    ORMSchemaAnalyzer,
    DevOpsAnalyzer,
    ReadmeAnalyzer,
  ],
  controllers: [GithubQlController],
  exports: [GithubQlService],
})
export class GithubQlModule {}
