import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScanGithubUserDto {
  @ApiProperty({
    description: 'GitHub username to scan',
    example: 'torvalds',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Force refresh even if data exists',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  forceRefresh?: boolean;

  @ApiProperty({
    description: 'Maximum number of repositories to scan (1-100)',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  maxRepos?: number;
}

export class ScanRepositoryDto {
  @ApiProperty({
    description: 'Repository owner username',
    example: 'torvalds',
  })
  @IsString()
  @IsNotEmpty()
  owner: string;

  @ApiProperty({
    description: 'Repository name',
    example: 'linux',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Force refresh even if data exists',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  forceRefresh?: boolean;
}
