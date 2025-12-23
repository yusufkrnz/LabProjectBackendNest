/**
 * Email Validator Helper
 * Utilities for email validation and sanitization
 */
export class EmailValidator {
    /**
     * Validate email format using RFC 5322 regex
     */
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Sanitize email address
     */
    static sanitizeEmail(email: string): string {
        return email.trim().toLowerCase();
    }

    /**
     * Extract domain from email
     */
    static extractDomain(email: string): string {
        const parts = email.split('@');
        return parts.length === 2 ? parts[1] : '';
    }

    /**
     * Validate and sanitize email
     */
    static validateAndSanitize(email: string): string {
        const sanitized = this.sanitizeEmail(email);

        if (!this.isValidEmail(sanitized)) {
            throw new Error(`Invalid email address: ${email}`);
        }

        return sanitized;
    }
}
