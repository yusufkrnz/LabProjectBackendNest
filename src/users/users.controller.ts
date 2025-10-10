import { Controller, Get, Post, Body, Param, Patch, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Gender } from 'src/schemas/gender-enum';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { RolesEnum } from 'src/common/decators/roles/roles.enum';
import { Roles } from 'src/common/decators/roles/roles.decator';
import { RolesGuard } from 'src/common/decators/roles/roles.guard';
import { JwtAuthGuard } from 'src/common/auth/jwt/jwt.guard';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string; role?: string }) {
    return this.usersService.createUser(body.username, body.password, body.role);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    const numericId = Number(userId);
    if (isNaN(numericId)) throw new NotFoundException('Invalid user id');
    return this.usersService.findByUserId(numericId);
  }

  @Get('by-id/:id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: Partial<{ username: string; password: string; role: string }>) {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post('reset')
  async resetUsers() {
    return this.usersService.resetUsers();
  }
}


