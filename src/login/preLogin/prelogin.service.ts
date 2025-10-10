import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class PreloginService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
   private readonly jwtService:JwtService
) {}

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(body: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(body);
    return createdUser.save();
  }

  async updateUser(id: string, body: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, body, { new: true }).exec();
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const res = await this.userModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('User not found');
    return true;
  }

async login(username: string, password: string) {
  // Önce veritabanından kullanıcıyı bul
  const user = await this.userModel.findOne({ username }).exec();
  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  // Şifre kontrolü
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new UnauthorizedException('Invalid password');

  // JWT payload oluştur
  const payload = { 
    sub: user._id, 
    username: user.username, 
    role: user.role,
    userId: user.userId
  };
  
  // Access Token (15 dakika)
  const accessToken = this.jwtService.sign(payload, { 
    expiresIn: '15m' 
  });
  
  // Refresh Token (7 gün)
  const refreshToken = this.jwtService.sign(
    { sub: user._id }, 
    { expiresIn: '7d' }
  );

  // Refresh token'ı veritabanına kaydet
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();
  
  return { 
    success: true,
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      userId: user.userId,
      username: user.username,
      role: user.role,
      eMail: user.eMail
    }
  };
}




}
