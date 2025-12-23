import {
  Post,
  Body,
  Get,
  UseGuards,
  Controller,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(@Body() data: any) {
    return this.authService.signin(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  logout(@Req() req: any) {
    const userId = req.user['sub'];
    return this.authService.logout(userId);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  refreshTokens(@Req() req: any) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshToken(userId, refreshToken);
  }

  // ==================== Google OAuth Endpoints ====================

  /**
   * Initiate Google OAuth flow
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guard redirects to Google
  }

  /**
   * Google OAuth callback
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const user = req.user;
    const dbUser = await this.authService.validateGoogleUser(user);
    const loginData = await this.authService.googleLogin(dbUser);

    const needsOnboarding = dbUser.onboardingStatus !== 'completed';
    const isNewUser =
      dbUser.createdAt?.getTime() === dbUser.updatedAt?.getTime();

    const redirectUrl = needsOnboarding
      ? `${process.env.FRONTEND_URL}/onboarding?token=${loginData.accessToken}&new=${isNewUser}`
      : `${process.env.FRONTEND_URL}/dashboard?token=${loginData.accessToken}`;

    return res.redirect(redirectUrl);
  }

  // ==================== Onboarding Endpoints ====================

  @Post('onboarding/complete')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async completeOnboarding(
    @Req() req: any,
    @Body() dto: { githubUsername?: string; claimedTechnologies?: string[] },
  ) {
    const userId = req.user.sub;
    return this.authService.completeOnboarding(userId, dto);
  }

  @Get('onboarding/status')
  @UseGuards(AuthGuard('jwt'))
  async getOnboardingStatus(@Req() req: any) {
    const userId = req.user.sub;
    return this.authService.getOnboardingStatus(userId);
  }
}
