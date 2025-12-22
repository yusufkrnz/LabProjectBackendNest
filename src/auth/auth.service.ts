import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RefreshTokenStrategy } from './refreshToken.strategy';
import { User } from 'src/schemas/user.schema';
import { PartialUpdateUserDto, UpdateUserDto } from 'src/users/dto/update-user.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async getTokens(userId: string, email: string) {
    const jwtPayload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateUser(userId, { refreshToken: hash });
  }

  async signin(dto: any) {
    const user = await this.usersService.findById(dto.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const tokens = await this.getTokens(user._id, user.email);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }


  //id: string, updateUserDto: UpdateUserDto    

  async logout(userId: string) {
    const updateDto: PartialUpdateUserDto = {
      refreshToken: null,
    };
    await this.usersService.updateUser(userId, updateDto);
    return { message: 'Logged out' };
  }


  async refreshToken(userId: string, refreshToken: string) { }







}
