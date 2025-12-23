import { Injectable } from '@nestjs/common';
import { EmailStrategy, EmailContext } from './email-strategy.interface';

/**
 * Notification Email Strategy
 * Sends general notifications with custom messages
 */
@Injectable()
export class NotificationStrategy implements EmailStrategy {
    getTemplate(): string {
        return 'notification';
    }

    getSubject(context: EmailContext): string {
        return context.subject || 'New Notification - Lab Project';
    }

    getContext(data: any): EmailContext {
        return {
            name: data.name,
            title: data.title || 'New Notification',
            message: data.message,
            actionUrl: data.actionUrl || `${process.env.FRONTEND_URL}/notifications`,
            actionText: data.actionText || 'View Notification',
            supportEmail: process.env.SMTP_FROM_EMAIL || 'support@labproject.com',
        };
    }
}
