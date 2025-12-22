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
}

export const GithubRepositorySchema = SchemaFactory.createForClass(GithubRepository);

// Create indexes for better query performance
GithubRepositorySchema.index({ 'owner.login': 1 });
GithubRepositorySchema.index({ fullName: 1 });
GithubRepositorySchema.index({ scannedAt: -1 });
