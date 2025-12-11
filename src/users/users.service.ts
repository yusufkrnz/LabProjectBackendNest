import { Injectable } from '@nestjs/common';
import { User } from './users.controller';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UsersService {
  static findById(id: string): User[] {
    throw new Error('Method not implemented.');
  }
  private users: User[] = [];

  async findOne(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  findById(id: string): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  update(id: string, data: any) {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
