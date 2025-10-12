import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { CookieUtil } from '../utils/cookie.util';



@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy){
    constructor(private authService:AuthService){
        super({
         jwtFromRequest:ExtractJwt.fromExtractors([
            (req)=>CookieUtil.getRefreshTokenCookie(req),
            ExtractJwt.fromAuthHeaderAsBearerToken(),
         ]),
         secretOrKey:process.env.JWT_REFRESH_SECRET||'refresh_secret',
         passReqToCallback:true,
        });
    }


    async validate(req:any,payload:any):Promise<any>{
        const refreshToken =
        CookieUtil.getRefreshTokenCookie(req)||
        req.headers.authorization?.replace('Bearer ','');
       
        const user = await this.authService.validateRefreshToken(refreshToken,payload);
        if(!user){
            throw new UnauthorizedException('Invalid refresh token');
        }
        return user;
    }

    



}