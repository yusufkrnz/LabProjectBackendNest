import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
    super({
      //detaylıca dokumana bakmak lazım
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.refresh_token,
      ]),
      secretOrKey: jwtSecret,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }
    return { ...payload, refreshToken };
  }
}
