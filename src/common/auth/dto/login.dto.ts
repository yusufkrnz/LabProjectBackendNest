import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';



export class LoginDto{

    @ApiProperty({ description: 'Kullanıcı adı', example: 'john_doe' })
    @IsString({ message: 'Username must be a string' })
    @MinLength(3, { message: 'Username must be at least 3 characters' })
    @MaxLength(20, { message: 'Username must not exceed 20 characters' })
    username: string;
  

    @ApiProperty({ description: 'Şifre', example: 'password123' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;


}