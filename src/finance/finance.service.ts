import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { Payment } from '../entities/payment.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  // Get all work in progress projects for a user
  async getWorkInProgress(userId: string): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Get payment history for a user
  async getPaymentHistory(userId: string): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { userId },
      order: { paymentDate: 'DESC' },
    });
  }

  // Create a new project
  async createProject(
    userId: string,
    createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      userId,
    });
    return await this.projectRepository.save(project);
  }

  // Update a project
  async updateProject(
    projectId: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    Object.assign(project, updateProjectDto);
    return await this.projectRepository.save(project);
  }

  // Delete a project
  async deleteProject(projectId: string): Promise<void> {
    const result = await this.projectRepository.delete(projectId);
    if (result.affected === 0) {
      throw new NotFoundException('Project not found');
    }
  }

  // Update milestone status
  async updateMilestone(
    projectId: string,
    milestoneId: string,
    updateMilestoneDto: UpdateMilestoneDto,
  ): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const milestoneIndex = project.milestones.findIndex(
      (m) => m.id === milestoneId,
    );
    if (milestoneIndex === -1) {
      throw new NotFoundException('Milestone not found');
    }

    project.milestones[milestoneIndex].status = updateMilestoneDto.status;
    return await this.projectRepository.save(project);
  }

  // Create a new payment
  async createPayment(
    userId: string,
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      userId,
    });
    return await this.paymentRepository.save(payment);
  }

  // Get a single project
  async getProject(projectId: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  // Get a single payment
  async getPayment(paymentId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }
}
