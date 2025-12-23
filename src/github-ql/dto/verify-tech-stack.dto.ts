import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTechStackDto {
  @ApiProperty({ example: 'johndoe', description: 'GitHub username' })
  @IsString()
  username: string;

  @ApiProperty({
    example: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    description: 'List of claimed technologies to verify',
  })
  @IsArray()
  @IsString({ each: true })
  claimedTechnologies: string[];
}
