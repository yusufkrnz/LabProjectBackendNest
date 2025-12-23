import { Injectable } from '@nestjs/common';
import { EmailStrategy, EmailContext } from './email-strategy.interface';

/**
 * Email Verification Strategy
 * Sends email verification link for account activation
 */
@Injectable()
export class EmailVerificationStrategy implements EmailStrategy {
    getTemplate(): string {
        return 'email-verification';
    }

    getSubject(_context: EmailContext): string {
        return 'Verify Your Email - Lab Project';
    }

    getContext(data: any): EmailContext {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${data.token}`;

        return {
            name: data.name,
            verifyUrl,
            expiresIn: '24 hours',
            supportEmail: process.env.SMTP_FROM_EMAIL || 'support@labproject.com',
        };
    }
}
