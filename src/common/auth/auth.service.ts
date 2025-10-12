import { Injectable, NotFoundException,UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { PasswordUtil } from './utils/password.util';  // Import ekle



@Injectable()
export class AuthService {
  constructor( 
    private readonly usersService: UsersService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async createUser(username: string, password: string, role: string = 'user') {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ username, passwordHash, role });
    return newUser.save();
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  async findById(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async setRefreshTokenHash(userId: string, hash: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    user.refreshTokenHash = hash;
    await user.save();
  }

  async clearRefreshTokenHash(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    user.refreshTokenHash = undefined;
    await user.save();
  }

  async validateRefreshToken(refreshToken: string, payload: any) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret') as any;
      const user = await this.usersService.findById(decoded.sub);

    if (!user || !(await bcrypt.compare(refreshToken, user.refreshTokenHash || ''))) {
  throw new UnauthorizedException('Invalid refresh token');
}

      return user;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.findByUsername(username);
    if (user && await PasswordUtil.verifyPassword(password, user.passwordHash)) {
      return user;
    }
    return null;
  }



}
