import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

export enum PaymentStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  FAILED = 'failed',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'Bank Transfer',
  PAYPAL = 'PayPal',
  CREDIT_CARD = 'Credit Card',
  STRIPE = 'Stripe',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  projectId: string;

  @ManyToOne(() => Project, { nullable: true })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  projectTitle: string;

  @Column()
  clientName: string;

  @Column()
  clientAvatar: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('date')
  paymentDate: Date;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ unique: true })
  transactionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
