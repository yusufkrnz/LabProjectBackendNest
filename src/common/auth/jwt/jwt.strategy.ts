import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from '../../constants/auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'access_secret',
    });
  }

  async validate(payload: any) {
    // JWT payload'ından user bilgilerini döndür
    const user = { 
      sub: payload.sub, 
      userId: payload.userId,                 // dikkat edilmesi gerekn önemli bi kısım patlattı bizi
      role: payload.role,                    // ✅ Decators guard için role string
      roles: payload.roles || [payload.role], // ✅ Auth guard için roles array
      username: payload.username
    };
    return user;
  }
}
