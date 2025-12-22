import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'User name', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'User email', example: 'john@example.com' })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'User password', example: 'SecurePass123!' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: 'GitHub username for automatic repository scanning',
        example: 'yusufkrnz',
        required: false
    })
    @IsOptional()
    @IsString()
    githubUsername?: string;
}