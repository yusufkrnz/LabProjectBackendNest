import { Controller, Get, Post, Put, Body, UseGuards, Request } from '@nestjs/common';
import { PostloginService } from './postlogin.service';
import { JwtAuthGuard } from 'src/common/auth/jwt/jwt.guard';

@Controller('postlogin')
export class PostloginController {
  constructor(private readonly postloginService: PostloginService) {}

  // Profil bilgileri
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    return this.postloginService.getProfile(req.user.sub);
  }

  // Profil güncelleme
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req: any, @Body() body: any) {
    return this.postloginService.updateProfile(req.user.sub, body);
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
