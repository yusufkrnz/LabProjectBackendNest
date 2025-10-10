import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PostloginService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  // Token yenileme
  async refreshToken(refreshToken: string) {
    try {
      // Refresh token'ı decode et
      const decoded = this.jwtService.verify(refreshToken);
      
      // Kullanıcıyı bul
      const user = await this.userModel.findById(decoded.sub).exec();
      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Refresh token'ı doğrula
      const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Yeni access token oluştur  . payload, JWT içinde taşınacak veri paketidir.
      const payload = {
        sub: user._id,
        username: user.username,
        role: user.role,
        userId: user.userId
      };

      const newAccessToken = this.jwtService.sign(payload, { 
        expiresIn: '15m' 
      });

      return {
        success: true,
        accessToken: newAccessToken,
        user: {
          id: user._id,
          userId: user.userId,
          username: user.username,
          role: user.role,
          eMail: user.eMail
        }
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Logout
  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(
      userId, 
      { refreshTokenHash: undefined }
    ).exec();
    
    return { success: true, message: 'Logged out successfully' };
  }

  // Şifre değiştirme
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Eski şifreyi kontrol et
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid old password');
    }

    // Yeni şifreyi hashle ve kaydet
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newPasswordHash;
    await user.save();

    return { success: true, message: 'Password changed successfully' };
  }
}
