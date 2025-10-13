import { IsString, IsOptional, MinLength, MaxLength,IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';





export class RegisterDto {
  @ApiProperty({description:'Kullanıcı adı',example:'john_john'})
  @IsString({message:'Kullanıcı adı string olmalı'})
  @IsNotEmpty({message:'Kullanıcı adı boş olamaz'})
  @MinLength(3,{message:'Kullanıcı adı en az 3 karakter olmalı'})
  @MaxLength(20,{message:'Kullanıcı adı en fazla 20 karakter olmalı'})
  username: string;

  @ApiProperty({description:'Soyadı',example:'Doe'})
  @IsString({message:'Soyadı string olmalı'})
  @IsNotEmpty({message:'Soyadı boş olamaz'})
  surname: string;

  @ApiProperty({ description: 'Şifre', example: 'password123' })
  @IsString({ message: 'Şifre string olmalı' })
  @IsNotEmpty({ message: 'Şifre boş olamaz' })
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalı' })
  password: string;

  @ApiProperty({ description: 'Email adresi', example: 'user@example.com' })
  @IsString({ message: 'Email string olmalı' })
  @IsNotEmpty({ message: 'Email boş olamaz' })
  eMail: string;

  @ApiPropertyOptional({ description: 'Rol', example: 'user' })
  @IsOptional()
  @IsString({ message: 'Rol string olmalı' })
  role?: string;

}