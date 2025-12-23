import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserGithubScanDocument = UserGithubScan & Document;

@Schema({ timestamps: true })
export class UserGithubScan {
  @Prop({ required: true, unique: true })
  userId: string; // User's MongoDB _id

  @Prop({ required: true })
  githubUsername: string;

  @Prop({ required: true })
  lastScanDate: Date;

  @Prop({ default: 1 })
  scanCount: number; // Total scans performed

  @Prop({ default: 1 })
  weeklyScansRemaining: number; // Scans remaining this week

  @Prop()
  nextScanAvailableAt: Date; // When next scan is available (7 days from last scan)

  @Prop({ default: true })
  isEligibleForScan: boolean; // Can user scan now?
}

export const UserGithubScanSchema =
  SchemaFactory.createForClass(UserGithubScan);

// Indexes for performance
UserGithubScanSchema.index({ userId: 1 });
UserGithubScanSchema.index({ githubUsername: 1 });
UserGithubScanSchema.index({ nextScanAvailableAt: 1 });
