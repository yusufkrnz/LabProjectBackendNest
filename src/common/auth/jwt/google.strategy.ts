import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  // Return minimal, transport-safe payload for guard → controller
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const emails = profile.emails || [];
    const primaryEmail = emails.length > 0 ? emails[0].value : undefined;

    return {
      provider: 'google',
      googleId: profile.id,
      email: primaryEmail,
      displayName: profile.displayName,
      name: {
        familyName: profile.name?.familyName,
        givenName: profile.name?.givenName,
      },
      photos: profile.photos || [],
    };
  }
}


