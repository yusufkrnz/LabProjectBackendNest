import { Injectable } from '@nestjs/common';
import { EmailStrategy, EmailContext } from './email-strategy.interface';

/**
 * Password Reset Email Strategy
 * Sends password reset link with security warnings
 */
@Injectable()
export class PasswordResetStrategy implements EmailStrategy {
    getTemplate(): string {
        return 'password-reset';
    }

    getSubject(_context: EmailContext): string {
        return 'Reset Your Password - Lab Project';
    }

    getContext(data: any): EmailContext {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${data.token}`;

        return {
            name: data.name,
            resetUrl,
            expiresIn: '15 minutes',
            supportEmail: process.env.SMTP_FROM_EMAIL || 'support@labproject.com',
        };
    }
}
