import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Get()
  async findById(@Param('email') email: string) {
    return await this.usersService.findById(email);
  }
}