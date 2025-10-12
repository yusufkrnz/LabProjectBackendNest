import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersModule } from 'src/users/users.module';  // ✅ Burada doğru yol çok önemli!
import { LocalStrategy } from './jwt/local.strategy';
import { CommonModule } from '../common.module';

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
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
