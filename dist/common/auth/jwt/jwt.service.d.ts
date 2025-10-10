import { JwtService as NestJwtService } from '@nestjs/jwt';
export declare class JwtAuthService {
    private jwt;
    constructor(jwt: NestJwtService);
    signAccessToken(payload: any): string;
    signRefreshToken(payload: any): string;
    verify(token: string): any;
    decode(token: string): any;
}
