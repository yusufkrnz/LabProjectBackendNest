import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from '../../constants/auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // JWT payload'ından user bilgilerini döndür
    return { 
      sub: payload.sub, 
      userId: payload.userId,
      role: payload.role,
      roles: payload.roles || [payload.role], // roles array'i varsa kullan, yoksa role'den oluştur
      username: payload.username
    };
  }
}
