import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from '../../constants/auth.constants';




@Injectable()
export class JwtAuthService{


    constructor(private jwt:NestJwtService){}

  signAccessToken(payload: any) {
    return this.jwt.sign(payload, { expiresIn: ACCESS_TOKEN_EXPIRATION });
  }

  signRefreshToken(payload: any) {
    return this.jwt.sign(payload, { expiresIn: REFRESH_TOKEN_EXPIRATION });
  }

  verify(token: string) {
    return this.jwt.verify(token);
  }

  decode(token: string) {
    return this.jwt.decode(token);
  }
   



}