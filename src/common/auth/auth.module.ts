import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersModule } from 'src/users/users.module'; 
import { LocalStrategy } from './jwt/local.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { GoogleStrategy } from './jwt/google.strategy';
import { CommonModule } from '../common.module';
import { RegisterDto} from "./dto/register.dto";
import {LoginDto}from "./dto/login.dto"
import { RefreshDto} from "./dto/refresh.dto";
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule, // ✅ UsersService buradan gelecek
    PassportModule,
    CommonModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'access_secret',
      signOptions: { expiresIn: '15m' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers:[AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
