import {
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectStatus, MilestoneStatus } from '../../entities/project.entity';

export class CreateMilestoneDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsNumber()
  amount: number;

  @IsEnum(MilestoneStatus)
  status: MilestoneStatus;
}

export class CreateProjectDto {
  @IsString()
  projectTitle: string;

  @IsString()
  clientName: string;

  @IsString()
  clientAvatar: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  deadline: string;

  @IsNumber()
  totalBudget: number;

  @IsNumber()
  @IsOptional()
  earnedAmount?: number;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMilestoneDto)
  milestones: CreateMilestoneDto[];
}
