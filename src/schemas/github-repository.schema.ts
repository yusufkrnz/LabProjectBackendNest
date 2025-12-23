import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GithubRepositoryDocument = GithubRepository & Document;

@Schema({ timestamps: true })
export class GithubRepository {
  @Prop({ required: true, unique: true })
  githubId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  description: string;

  @Prop({ type: Object, required: true })
  owner: {
    login: string;
    avatarUrl: string;
    type: string; // User or Organization
    url: string;
  };

  @Prop({ required: true })
  url: string;

  @Prop()
  homepageUrl: string;

  @Prop({ default: false })
  isPrivate: boolean;

  @Prop({ default: false })
  isFork: boolean;

  @Prop({ default: 0 })
  stargazersCount: number;

  @Prop({ default: 0 })
  forksCount: number;

  @Prop({ default: 0 })
  watchersCount: number;

  @Prop({ type: Object })
  primaryLanguage: {
    name: string;
    color: string;
  };

  @Prop({ type: [Object] })
  languages: Array<{
    name: string;
    size: number;
    percentage: number;
  }>;

  @Prop({ type: [String] })
  topics: string[];

  @Prop()
  repositoryCreatedAt: Date;

  @Prop()
  repositoryUpdatedAt: Date;

  @Prop()
  pushedAt: Date;

  @Prop({ default: 0 })
  diskUsage: number; // in KB

  @Prop({ type: [Object] })
  recentCommits: Array<{
    sha: string;
    message: string;
    author: string;
    date: Date;
  }>;

  @Prop({ type: Object })
  licenseInfo: {
    name: string;
    key: string;
  };

  @Prop()
  defaultBranch: string;

  @Prop()
  scannedAt: Date;

  @Prop()
  scannedBy: string; // User who triggered the scan

  // Tech Stack Detection Fields
  @Prop({ type: [String], default: [] })
  detectedFrameworks: string[]; // e.g., ['React', 'Next.js', 'Express']

  @Prop({ type: [String], default: [] })
  detectedDatabases: string[]; // e.g., ['PostgreSQL', 'MongoDB']

  @Prop({ type: [String], default: [] })
  detectedTools: string[]; // e.g., ['Docker', 'GitHub Actions']

  @Prop({ type: [String], default: [] })
  detectedLibraries: string[]; // e.g., ['Prisma', 'TypeORM', 'Axios']

  @Prop({ type: Object })
  packageJson: any; // Parsed package.json content

  @Prop({ type: [String], default: [] })
  dependencies: string[]; // All dependencies extracted from various files

  @Prop({ default: false })
  hasDocker: boolean;

  @Prop({ default: false })
  hasCICD: boolean;

  @Prop({ default: false })
  hasTests: boolean;

  @Prop()
  readmeContent: string; // README content for additional analysis
}

export const GithubRepositorySchema =
  SchemaFactory.createForClass(GithubRepository);

// Create indexes for better query performance
GithubRepositorySchema.index({ 'owner.login': 1 });
GithubRepositorySchema.index({ fullName: 1 });
GithubRepositorySchema.index({ scannedAt: -1 });
