import { Injectable } from '@nestjs/common';
import { EmailType } from '../strategies/email-strategy.interface';
import { EmailStrategy } from '../strategies/email-strategy.interface';
import { WelcomeEmailStrategy } from '../strategies/welcome-email.strategy';
import { PasswordResetStrategy } from '../strategies/password-reset.strategy';
import { EmailVerificationStrategy } from '../strategies/email-verification.strategy';
import { NotificationStrategy } from '../strategies/notification.strategy';

/**
 * Email Factory
 * Factory Pattern for creating appropriate email strategies
 */
@Injectable()
export class EmailFactory {
    constructor(
        private readonly welcomeStrategy: WelcomeEmailStrategy,
        private readonly passwordResetStrategy: PasswordResetStrategy,
        private readonly emailVerificationStrategy: EmailVerificationStrategy,
        private readonly notificationStrategy: NotificationStrategy,
    ) { }

    /**
     * Create email strategy based on type
     * @param type - Email type
     * @returns Appropriate email strategy
     */
    createEmailStrategy(type: EmailType): EmailStrategy {
        switch (type) {
            case EmailType.WELCOME:
                return this.welcomeStrategy;
            case EmailType.PASSWORD_RESET:
                return this.passwordResetStrategy;
            case EmailType.EMAIL_VERIFICATION:
                return this.emailVerificationStrategy;
            case EmailType.NOTIFICATION:
                return this.notificationStrategy;
            default:
                throw new Error(`Unknown email type: ${type}`);
        }
    }
}
