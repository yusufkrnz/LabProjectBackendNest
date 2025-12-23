import { Injectable } from '@nestjs/common';
import { EmailStrategy, EmailContext } from './email-strategy.interface';

/**
 * Welcome Email Strategy
 * Sends a welcome message to newly registered users
 */
@Injectable()
export class WelcomeEmailStrategy implements EmailStrategy {
    getTemplate(): string {
        return 'welcome';
    }

    getSubject(context: EmailContext): string {
        return `Welcome to Lab Project, ${context.name}! 🎉`;
    }

    getContext(data: any): EmailContext {
        return {
            name: data.name,
            email: data.email,
            dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
            supportEmail: process.env.SMTP_FROM_EMAIL || 'support@labproject.com',
        };
    }
}
