import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  Delete, 
  NotFoundException, 
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/schemas/user.schema';
import { RolesEnum } from 'src/common/decators/roles/roles.enum';
import { Roles } from 'src/common/decators/roles/roles.decator';
import { RolesGuard } from 'src/common/decators/roles/roles.guard';
import { JwtAuthGuard } from 'src/common/auth/jwt/jwt.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam,
  ApiBody 
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel(User.name) public model: Model<User>,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['username', 'password'], // ✅ Burada olmalı!
      properties: {
        username: { type: 'string', example: 'john_doe' },
        password: { type: 'string', example: 'SecurePass123!' },
        role: { type: 'string', example: 'user' }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input' })
  @ApiResponse({ status: 409, description: 'Conflict - Username already exists' })
  async register(@Body() body: { username: string; password: string; role?: string }) {
    return this.usersService.createUser(body.username, body.password, body.role);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiBearerAuth('JWT-auth')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Get user by userId (Admin only)' })
  @ApiParam({ name: 'userId', description: 'User ID number', example: '12345' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiBearerAuth('JWT-auth')
  async findOne(@Param('userId') userId: string) {
    const numericId = Number(userId);
    if (isNaN(numericId)) {
      throw new NotFoundException('Invalid user id');
    }
    return this.usersService.findByUserId(numericId);
  }

  @Get('by-id/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Get user by MongoDB _id (Admin only)' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiBearerAuth('JWT-auth')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Update user (Admin only)' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        role: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id') id: string, 
    @Body() body: Partial<{ username: string; password: string; role: string }>
  ) {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 204, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiBearerAuth('JWT-auth')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post('reset')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset all users (Admin only) - DANGEROUS!' })
  @ApiResponse({ status: 200, description: 'All users successfully reset' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiBearerAuth('JWT-auth')
  async resetUsers() {
    return this.usersService.resetUsers();
  }
}