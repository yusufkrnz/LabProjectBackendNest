import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { Project } from '../entities/project.entity';
import { Payment } from '../entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Payment])],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
