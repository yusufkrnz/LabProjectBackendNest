import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { Gender } from 'src/schemas/gender-enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(username: string, password: string, role: string = 'user'): Promise<UserDocument> {
    // En büyük userId'yi bul ve bir artır
    const lastUser = await this.userModel.findOne().sort({ userId: -1 }).exec();
    const nextUserId = (lastUser && lastUser.userId) ? lastUser.userId + 1 : 1;
    
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      username,
      passwordHash,
      role,
      eMail: `${username}@example.com`,
      gender: Gender.MALE,
      userId: nextUserId,
    });
    return newUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findByUserId(userId: number): Promise<UserDocument> {
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<UserDocument> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async deleteUser(id: string): Promise<{ success: boolean }> {
    const deleted = await this.userModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('User not found');
    return { success: true };
  }

  async resetUsers(): Promise<{ success: boolean; count: number }> {
    await this.userModel.deleteMany({}).exec();

    const users: Partial<User>[] = [];
    for (let i = 1; i <= 30; i++) {
      const passwordHash = await bcrypt.hash(`password${i}`, 10);
      users.push({
        username: `User${i}`,
        eMail: `user${i}@example.com`,
        gender: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
        role: 'user',
        isActive: true,
        userId: i, 
        passwordHash,
      });
    }

    await this.userModel.insertMany(users);

    return { success: true, count: users.length };
  }
}

