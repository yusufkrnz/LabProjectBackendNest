import { IsString, IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { PaymentStatus, PaymentMethod } from '../../entities/payment.entity';

export class CreatePaymentDto {
    @IsString()
    @IsOptional()
    projectId?: string;

    @IsString()
    projectTitle: string;

    @IsString()
    clientName: string;

    @IsString()
    clientAvatar: string;

    @IsNumber()
    amount: number;

    @IsDateString()
    paymentDate: string;

    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @IsEnum(PaymentStatus)
    @IsOptional()
    status?: PaymentStatus;

    @IsString()
    transactionId: string;
}
