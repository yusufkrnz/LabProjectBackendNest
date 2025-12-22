import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FinanceService } from './finance.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Controller('finance')
@UseGuards(AuthGuard('jwt'))
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

    // Get work in progress projects
    @Get('projects')
    async getWorkInProgress(@Req() req: any) {
        const userId = req.user.sub;
        return await this.financeService.getWorkInProgress(userId);
    }

    // Get payment history
    @Get('payments')
    async getPaymentHistory(@Req() req: any) {
        const userId = req.user.sub;
        return await this.financeService.getPaymentHistory(userId);
    }

    // Get single project
    @Get('projects/:id')
    async getProject(@Param('id') id: string) {
        return await this.financeService.getProject(id);
    }

    // Create new project
    @Post('projects')
    async createProject(@Req() req: any, @Body() createProjectDto: CreateProjectDto) {
        const userId = req.user.sub;
        return await this.financeService.createProject(userId, createProjectDto);
    }

    // Update project
    @Patch('projects/:id')
    async updateProject(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
        return await this.financeService.updateProject(id, updateProjectDto);
    }

    // Delete project
    @Delete('projects/:id')
    async deleteProject(@Param('id') id: string) {
        await this.financeService.deleteProject(id);
        return { message: 'Project deleted successfully' };
    }

    // Update milestone status
    @Patch('projects/:projectId/milestones/:milestoneId')
    async updateMilestone(
        @Param('projectId') projectId: string,
        @Param('milestoneId') milestoneId: string,
        @Body() updateMilestoneDto: UpdateMilestoneDto,
    ) {
        return await this.financeService.updateMilestone(projectId, milestoneId, updateMilestoneDto);
    }

    // Create new payment
    @Post('payments')
    async createPayment(@Req() req: any, @Body() createPaymentDto: CreatePaymentDto) {
        const userId = req.user.sub;
        return await this.financeService.createPayment(userId, createPaymentDto);
    }

    // Get single payment
    @Get('payments/:id')
    async getPayment(@Param('id') id: string) {
        return await this.financeService.getPayment(id);
    }
}
