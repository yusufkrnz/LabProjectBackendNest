import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { EmailFactory } from './factories/email.factory';
import { WelcomeEmailStrategy } from './strategies/welcome-email.strategy';
import { PasswordResetStrategy } from './strategies/password-reset.strategy';
import { EmailVerificationStrategy } from './strategies/email-verification.strategy';
import { NotificationStrategy } from './strategies/notification.strategy';

@Module({
    imports: [
        ConfigModule,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get('SMTP_HOST', 'smtp.gmail.com'),
                    port: configService.get('SMTP_PORT', 587),
                    secure: configService.get('SMTP_SECURE', 'false') === 'true',
                    auth: {
                        user: configService.get('SMTP_USER'),
                        pass: configService.get('SMTP_PASSWORD'),
                    },
                },
                defaults: {
                    from: `"${configService.get('SMTP_FROM_NAME', 'Lab Project')}" <${configService.get('SMTP_FROM_EMAIL', 'noreply@labproject.com')}>`,
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
    ],
    providers: [
        MailService,
        EmailFactory,
        WelcomeEmailStrategy,
        PasswordResetStrategy,
        EmailVerificationStrategy,
        NotificationStrategy,
    ],
    exports: [MailService],
})
export class MailModule { }
