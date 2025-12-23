export class EmailResponseDto {
    success: boolean;
    messageId?: string;
    error?: string;

    constructor(success: boolean, messageId?: string, error?: string) {
        this.success = success;
        this.messageId = messageId;
        this.error = error;
    }

    static success(messageId: string): EmailResponseDto {
        return new EmailResponseDto(true, messageId);
    }

    static failure(error: string): EmailResponseDto {
        return new EmailResponseDto(false, undefined, error);
    }
}
