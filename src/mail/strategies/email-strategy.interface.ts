export enum EmailType {
    WELCOME = 'welcome',
    PASSWORD_RESET = 'password-reset',
    EMAIL_VERIFICATION = 'email-verification',
    NOTIFICATION = 'notification',
}

export interface EmailContext {
    [key: string]: any;
}

export interface EmailStrategy {
    getTemplate(): string;
    getSubject(context: EmailContext): string;
    getContext(data: any): EmailContext;
}
