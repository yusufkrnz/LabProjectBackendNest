import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AccessTokenStrategy } from './accessToken.strategy';
import { RefreshTokenStrategy } from './refreshToken.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    ConfigModule,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
