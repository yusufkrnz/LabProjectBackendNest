import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailType } from './strategies/email-strategy.interface';
import { EmailFactory } from './factories/email.factory';
import { EmailValidator } from './helpers/email-validator.helper';
import { EmailResponseDto } from './dto/email-response.dto';

/**
 * Mail Service
 * Core service for sending emails using Template Method Pattern
 */
@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(
        private readonly mailerService: MailerService,
        private readonly emailFactory: EmailFactory,
    ) { }

    /**
     * Send email using strategy pattern
     * Template Method Pattern: defines the skeleton of email sending
     */
    async sendEmail(
        to: string,
        type: EmailType,
        data: any,
    ): Promise<EmailResponseDto> {
        try {
            // Step 1: Validate email
            const sanitizedEmail = EmailValidator.validateAndSanitize(to);

            // Step 2: Get appropriate strategy
            const strategy = this.emailFactory.createEmailStrategy(type);

            // Step 3: Prepare email context
            const context = strategy.getContext(data);
            const subject = strategy.getSubject(context);
            const template = strategy.getTemplate();

            // Step 4: Send email
            this.logger.log(`Sending ${type} email to ${sanitizedEmail}`);

            const result = await this.mailerService.sendMail({
                to: sanitizedEmail,
                subject,
                template,
                context,
            });

            this.logger.log(`Email sent successfully: ${result.messageId}`);
            return EmailResponseDto.success(result.messageId);
        } catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`, error.stack);
            return EmailResponseDto.failure(error.message);
        }
    }

    /**
     * Send welcome email to new users
     */
    async sendWelcomeEmail(email: string, name: string): Promise<EmailResponseDto> {
        return this.sendEmail(email, EmailType.WELCOME, { email, name });
    }

    /**
     * Send password reset email
     */
    async sendPasswordResetEmail(
        email: string,
        name: string,
        token: string,
    ): Promise<EmailResponseDto> {
        return this.sendEmail(email, EmailType.PASSWORD_RESET, { email, name, token });
    }

    /**
     * Send email verification
     */
    async sendEmailVerification(
        email: string,
        name: string,
        token: string,
    ): Promise<EmailResponseDto> {
        return this.sendEmail(email, EmailType.EMAIL_VERIFICATION, { email, name, token });
    }

    /**
     * Send notification email
     */
    async sendNotification(
        email: string,
        name: string,
        title: string,
        message: string,
        actionUrl?: string,
        actionText?: string,
    ): Promise<EmailResponseDto> {
        return this.sendEmail(email, EmailType.NOTIFICATION, {
            email,
            name,
            title,
            message,
            actionUrl,
            actionText,
        });
    }
}
