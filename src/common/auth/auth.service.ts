import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { PasswordUtil } from './utils/password.util';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';



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
      const user = await this.findById(decoded.sub as string);

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

  // Token generation methods
  generateTokens(user: any) {
    const payload = { 
      username: user.username, 
      sub: user._id, 
      role: user.role,
      roles: user.roles || [user.role],
      userId: user.userId
    };
    
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'access_secret',
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      { expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
  }

  // Auth controller methods
  async register(registerDto: RegisterDto) {
    const { username, surname, password, eMail, role = 'user' } = registerDto;
    
    // Check if user already exists
    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    
    // Generate unique userId
    const existingUsers = await this.userModel.find().sort({ userId: -1 }).limit(1).exec();
    const nextUserId = existingUsers.length > 0 ? (existingUsers[0].userId || 0) + 1 : 1;
    
    // Create new user
    const passwordHash = await PasswordUtil.hashPassword(password);
    const newUser = new this.userModel({ 
      userId: nextUserId,
      username, 
      surname,
      passwordHash, 
      eMail,
      role,
      gender: 1, // Default gender
      roles: [role]
    });
    
    const savedUser = await newUser.save();
    
    // Generate tokens
    const tokens = this.generateTokens(savedUser);
    
    // Store refresh token hash
    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.setRefreshTokenHash((savedUser._id as any).toString(), refreshTokenHash);
    
    return {
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        username: savedUser.username,
        eMail: savedUser.eMail,
        role: savedUser.role
      },
      tokens
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    
    // Validate user credentials
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Generate tokens
    const tokens = this.generateTokens(user);
    
    // Store refresh token hash
    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.setRefreshTokenHash((user._id as any).toString(), refreshTokenHash);
    
    return {
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        roles: user.roles
      },
      tokens
    };
  }

  async refresh(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret') as any;
      const user = await this.findById(decoded.sub);
      
      // Check if refresh token hash matches
      if (!user.refreshTokenHash || !(await bcrypt.compare(refreshToken, user.refreshTokenHash))) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      // Generate new tokens
      const tokens = this.generateTokens(user);
      
      // Store new refresh token hash
      const newRefreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
      await this.setRefreshTokenHash((user._id as any).toString(), newRefreshTokenHash);
      
      return {
        message: 'Tokens refreshed successfully',
        tokens
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.clearRefreshTokenHash(userId);
    return {
      message: 'Logout successful'
    };
  }
}
