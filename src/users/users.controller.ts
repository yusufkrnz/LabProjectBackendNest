import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

@Controller('users')
export class UsersController {
  @Get()
  findById(@Param('id') id: string): User[] {
    return UsersService.findOne(id);
  }
}
