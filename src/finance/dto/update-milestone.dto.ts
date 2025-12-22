import { IsEnum } from 'class-validator';
import { MilestoneStatus } from '../../entities/project.entity';

export class UpdateMilestoneDto {
    @IsEnum(MilestoneStatus)
    status: MilestoneStatus;
}
