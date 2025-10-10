import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PostloginService } from './postlogin.service';
import { JwtAuthGuard } from 'src/common/auth/jwt/jwt.guard';

@Controller('postlogin')
export class PostloginController {
  constructor(private readonly postloginService: PostloginService) {}

  // Token yenileme
  @Post('refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.postloginService.refreshToken(body.refreshToken);
  }

  // Logout
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: any) {
    return this.postloginService.logout(req.user.userId);
  }

  // Şifre değiştirme
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req: any,
    @Body() body: { oldPassword: string; newPassword: string }
  ) {
    return this.postloginService.changePassword(
      req.user.userId,
      body.oldPassword,
      body.newPassword
    );
  }
}
