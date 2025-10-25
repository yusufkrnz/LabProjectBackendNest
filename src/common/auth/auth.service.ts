import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { PasswordUtil } from './utils/password.util';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';



@Injectable()
export class AuthService {
  constructor( 
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      }) as any;
      const user = await this.findById(decoded.sub as string);

      if (!user || !(await bcrypt.compare(refreshToken, user.refreshTokenHash || ''))) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return user;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(usernameOrEmail: string, password: string): Promise<any> {
    // Hem username hem email ile arama yap
    let user = await this.findByUsername(usernameOrEmail);
    
    // Username ile bulunamazsa email ile dene
    if (!user) {
      user = await this.userModel.findOne({ eMail: usernameOrEmail }).exec();
    }
    
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
    
    const accessToken = this.jwtService.sign(payload);
    
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d'
    });
    
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
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      }) as any;
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

  // Google OAuth login flow
  async loginWithGoogle(googleUser: {
    provider: 'google';
    googleId: string;
    email?: string;
    displayName?: string;
  }) {
    // 1) Try to find user by googleId
    let user = await this.userModel.findOne({ googleId: googleUser.googleId }).exec();

    // 2) Fallback: match by email if available
    if (!user && googleUser.email) {
      user = await this.userModel.findOne({ eMail: googleUser.email }).exec();
      if (user) {
        user.set({ googleId: googleUser.googleId });
        await user.save();
      }
    }

    // 3) Create new user if still not found
    if (!user) {
      const lastUser = await this.userModel.findOne().sort({ userId: -1 }).exec();
      const nextUserId = lastUser?.userId ? lastUser.userId + 1 : 1;
      user = await new this.userModel({
        userId: nextUserId,
        username: googleUser.displayName || googleUser.email || `google_${googleUser.googleId}`,
        eMail: googleUser.email,
        role: 'user',
        roles: ['user'],
        isActive: true,
        googleId: googleUser.googleId,
      }).save();
    }

    // 4) Issue tokens (same flow as classic login)
    const tokens = this.generateTokens(user);
    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.setRefreshTokenHash((user._id as any).toString(), refreshTokenHash);

    return {
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        roles: user.roles,
      },
      tokens,
    };
  }
}
