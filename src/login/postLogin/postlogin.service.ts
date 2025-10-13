import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PostloginService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  // Profil bilgileri getir
  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      user: {
        id: user._id,
        userId: user.userId,
        username: user.username,
        role: user.role,
        eMail: user.eMail,
        createdAt: (user as any).createdAt,
        updatedAt: (user as any).updatedAt
      }
    };
  }

  // Profil güncelleme
  async updateProfile(userId: string, updateData: Partial<User>) {
    const user = await this.userModel.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true }
    ).exec();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        userId: user.userId,
        username: user.username,
        role: user.role,
        eMail: user.eMail
      }
    };
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
