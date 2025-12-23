import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';

/**
 * Notification Service
 * Handles both in-app and email notifications
 */
@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        @InjectModel(Notification.name)
        private notificationModel: Model<NotificationDocument>,
        private readonly mailService: MailService,
        private readonly usersService: UsersService,
    ) { }

    /**
     * Create notification and optionally send email
     */
    async create(
        createNotificationDto: CreateNotificationDto,
        sendEmail = true,
    ): Promise<NotificationDocument> {
        // Save to database for in-app notifications
        const notification = new this.notificationModel(createNotificationDto);
        const savedNotification = await notification.save();

        // Send email notification if enabled
        if (sendEmail) {
            try {
                const user = await this.usersService.findById(createNotificationDto.userId);

                if (user && user.email) {
                    void this.mailService.sendNotification(
                        user.email,
                        user.name || 'User',
                        createNotificationDto.title,
                        createNotificationDto.message,
                        createNotificationDto.actionUrl,
                        createNotificationDto.actionText,
                    );
                }
            } catch (error) {
                this.logger.error(`Failed to send email notification: ${error.message}`);
                // Don't fail the notification creation if email fails
            }
        }

        return savedNotification;
    }

    /**
     * Get all notifications for a user
     */
    async findByUserId(userId: string): Promise<NotificationDocument[]> {
        return this.notificationModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .exec();
    }

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId: string): Promise<NotificationDocument | null> {
        return this.notificationModel
            .findByIdAndUpdate(notificationId, { read: true }, { new: true })
            .exec();
    }

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId: string): Promise<void> {
        await this.notificationModel
            .updateMany({ userId, read: false }, { read: true })
            .exec();
    }

    /**
     * Delete notification
     */
    async remove(notificationId: string): Promise<void> {
        await this.notificationModel.findByIdAndDelete(notificationId).exec();
    }
}
