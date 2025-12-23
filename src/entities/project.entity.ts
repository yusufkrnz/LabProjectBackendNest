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

export enum ProjectStatus {
  ACTIVE = 'active',
  REVIEW = 'review',
  PENDING_PAYMENT = 'pending-payment',
  COMPLETED = 'completed',
}

export enum MilestoneStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  PAID = 'paid',
}

export class Milestone {
  @Column()
  id: string;

  @Column()
  title: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: MilestoneStatus,
    default: MilestoneStatus.PENDING,
  })
  status: MilestoneStatus;
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  projectTitle: string;

  @Column()
  clientName: string;

  @Column()
  clientAvatar: string;

  @Column('date')
  startDate: Date;

  @Column('date')
  deadline: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  totalBudget: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  earnedAmount: number;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;

  @Column('json')
  milestones: Milestone[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
