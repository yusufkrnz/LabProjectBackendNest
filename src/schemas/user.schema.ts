import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum OnboardingStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

@Schema({ timestamps: true })
export class User {
  // Basic Info
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password?: string; // Optional for OAuth users

  @Prop({ default: 'user' })
  role: string;

  // Google OAuth Fields
  @Prop({ unique: true, sparse: true })
  googleId?: string;

  @Prop()
  picture?: string;

  @Prop({ type: String, enum: AuthProvider, default: AuthProvider.LOCAL })
  provider: string;

  // Onboarding Tracking
  @Prop({
    type: String,
    enum: OnboardingStatus,
    default: OnboardingStatus.NOT_STARTED,
  })
  onboardingStatus: string;

  @Prop()
  onboardingCompletedAt?: Date;

  // GitHub Integration
  @Prop()
  githubUsername?: string;

  @Prop()
  githubProfileUrl?: string;

  // Tech Stack
  @Prop({ type: [String], default: [] })
  claimedTechnologies: string[];

  @Prop({ type: [String], default: [] })
  verifiedTechnologies: string[];

  @Prop({ type: [String], default: [] })
  badges: string[];

  // Refresh Token for JWT
  @Prop()
  refreshToken?: string;

  // Timestamps (auto-managed by Mongoose)
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ githubUsername: 1 });
UserSchema.index({ onboardingStatus: 1 });
