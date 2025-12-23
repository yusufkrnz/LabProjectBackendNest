import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    message: string;

    @IsOptional()
    @IsString()
    actionUrl?: string;

    @IsOptional()
    @IsString()
    actionText?: string;

    @IsOptional()
    @IsString()
    type?: string;
}
