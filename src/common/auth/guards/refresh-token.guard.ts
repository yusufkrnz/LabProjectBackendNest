import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class RefreshTokenGuard extends AuthGuard('refresh') {
   canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const refreshToken = request.cookies?.refreshToken;
    const accessToken = request.headers.authorization?.replace('Bearer ', '');
    
    if (accessToken) {
        throw new UnauthorizedException('Access token not allowed for refresh endpoint');
    }
    
    if (!refreshToken) {
        throw new UnauthorizedException('Refresh token required');
    }
      
    return super.canActivate(context);
   }
}