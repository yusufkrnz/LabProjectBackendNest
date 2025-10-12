/*
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class RefreshDto {

  @ApiPropertyOptional({ 

     //  İncelenecek bu kısım şimdilik dursun 

    description: 'Refresh token (opsiyonel - cookie kullanılıyorsa boş bırakın)', 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' 
  })
  @IsOptional()
  @IsString({ message: 'Refresh token must be a string' })
  @IsNotEmpty({ message: 'Refresh token cannot be empty' })
  refreshToken?: string;
}
  */