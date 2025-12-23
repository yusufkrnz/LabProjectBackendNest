import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    UseGuards,
    Req,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

@Controller('notification')
@UseGuards(AccessTokenGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    /**
     * Create a new notification
     */
    @Post()
    create(@Body() createNotificationDto: CreateNotificationDto) {
        return this.notificationService.create(createNotificationDto);
    }

    /**
     * Get all notifications for current user
     */
    @Get()
    findAll(@Req() req: any) {
        const userId = req.user.sub;
        return this.notificationService.findByUserId(userId);
    }

    /**
     * Mark notification as read
     */
    @Patch(':id/read')
    markAsRead(@Param('id') id: string) {
        return this.notificationService.markAsRead(id);
    }

    /**
     * Mark all notifications as read
     */
    @Patch('read-all')
    markAllAsRead(@Req() req: any) {
        const userId = req.user.sub;
        return this.notificationService.markAllAsRead(userId);
    }

    /**
     * Delete notification
     */
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.notificationService.remove(id);
    }
}
