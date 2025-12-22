import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {

    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const updateUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true })
        return updateUser;

    }


    async findById(email: string): Promise<User> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }







}
