import { IsString, IsOptional, MinLength, MaxLength,IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';





export class RegisterDto {
  @ApiProperty({description:'Kullanıcı adı',example:'john_john'})
  @IsString({message:'Kullanıcı adı string olmalı'})
  @IsNotEmpty({message:'Kullanıcı adı boş olamaz'})
  @MinLength(3,{message:'Kullanıcı adı en az 3 karakter olmalı'})
  @MaxLength(20,{message:'Kullanıcı adı en fazla 20 karakter olmalı'})
  username: string;

}