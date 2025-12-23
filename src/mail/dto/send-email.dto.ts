import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { EmailType } from '../strategies/email-strategy.interface';

export class SendEmailDto {
    @IsEmail()
    @IsNotEmpty()
    to: string;

    @IsEnum(EmailType)
    @IsNotEmpty()
    type: EmailType;

    @IsOptional()
    context?: any;
}
