import { Post, Body, Get, UseGuards, Controller, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

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
}
