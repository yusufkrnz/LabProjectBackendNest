import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  User,
  UserDocument,
  OnboardingStatus,
  AuthProvider,
} from 'src/schemas/user.schema';
import {
  PartialUpdateUserDto,
  UpdateUserDto,
} from 'src/users/dto/update-user.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

  /**
   * Generate JWT access and refresh tokens
   */
  async getTokens(userId: string, email: string) {
    const jwtPayload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Update user's refresh token in database
   */
  async updateRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateUser(userId, { refreshToken: hash });
  }

  /**
   * Traditional email/password signin
   */
  async signin(dto: any) {
    const user = await this.usersService.findById(dto.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const tokens = await this.getTokens(user._id.toString(), user.email);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);
    return tokens;
  }

  /**
   * Logout user by clearing refresh token
   */
  async logout(userId: string) {
    const updateDto: PartialUpdateUserDto = {
      refreshToken: null,
    };
    await this.usersService.updateUser(userId, updateDto);
    return { message: 'Logged out' };
  }

  /**
   * Refresh access token
   */
  async refreshToken(_userId: string, _refreshToken: string) { }

  // ==================== Google OAuth Methods ====================

  /**
   * Validate and find/create Google user
   * Called by Google Strategy after successful OAuth
   */
  async validateGoogleUser(googleProfile: any): Promise<UserDocument> {
    const { googleId, email, name, picture } = googleProfile;

    // Try to find existing user by Google ID
    let user = await this.usersService.findByGoogleId(googleId);

    if (user) {
      // Update picture if changed
      if (user.picture !== picture) {
        await this.usersService.updateUser(user._id.toString(), { picture });
      }
      return user;
    }

    // Try to find by email (user might have registered with email/password)
    user = await this.usersService.findByEmail(email);

    if (user) {
      // Link Google account to existing user
      await this.usersService.updateUser(user._id.toString(), {
        googleId,
        picture,
        provider: AuthProvider.GOOGLE,
      });
      return user;
    }

    // Create new user
    return this.createGoogleUser(googleProfile);
  }

  /**
   * Create new user from Google profile
   * Helper method following Single Responsibility Principle
   */
  private async createGoogleUser(googleProfile: any): Promise<UserDocument> {
    const { googleId, email, name, picture } = googleProfile;

    const newUser = {
      googleId,
      email,
      name,
      picture,
      provider: AuthProvider.GOOGLE,
      onboardingStatus: OnboardingStatus.NOT_STARTED,
      role: 'user',
    };

    const createdUser = await this.usersService.create(newUser);

    // Send welcome email asynchronously
    void this.mailService.sendWelcomeEmail(email, name);

    return createdUser;
  }

  /**
   * Generate login response with tokens and user data
   */
  async googleLogin(user: UserDocument) {
    const tokens = await this.getTokens(user._id.toString(), user.email);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        picture: user.picture,
        onboardingStatus: user.onboardingStatus,
        githubUsername: user.githubUsername,
      },
    };
  }

  // ==================== Onboarding Methods ====================

  /**
   * Complete user onboarding
   * Updates user profile with GitHub username and claimed technologies
   */
  async completeOnboarding(
    userId: string,
    data: {
      githubUsername?: string;
      claimedTechnologies?: string[];
    },
  ): Promise<UserDocument> {
    const updateData: any = {
      onboardingStatus: OnboardingStatus.COMPLETED,
      onboardingCompletedAt: new Date(),
    };

    if (data.githubUsername) {
      updateData.githubUsername = data.githubUsername;
      updateData.githubProfileUrl = `https://github.com/${data.githubUsername}`;
    }

    if (data.claimedTechnologies) {
      updateData.claimedTechnologies = data.claimedTechnologies;
    }

    return (await this.usersService.updateUser(
      userId,
      updateData,
    )) as UserDocument;
  }

  /**
   * Update onboarding status
   */
  async updateOnboardingStatus(
    userId: string,
    status: OnboardingStatus,
  ): Promise<UserDocument> {
    return (await this.usersService.updateUser(userId, {
      onboardingStatus: status,
    })) as UserDocument;
  }

  /**
   * Get onboarding status for user
   */
  async getOnboardingStatus(userId: string): Promise<{
    status: string;
    completedAt?: Date;
    githubUsername?: string;
  }> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      status: user.onboardingStatus,
      completedAt: user.onboardingCompletedAt,
      githubUsername: user.githubUsername,
    };
  }
}
