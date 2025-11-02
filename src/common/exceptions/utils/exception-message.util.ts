import { HttpException } from '@nestjs/common';

/**
 * Exception mesajını extract etmek için helper fonksiyonlar
 */
export class ExceptionMessageUtil {
  /**
   * HttpException'dan mesaj ve errors array'i extract et
   */
  static extractMessageAndErrors(exception: HttpException): {
    message: string;
    errors?: string[];
  } {
    const exceptionResponse = exception.getResponse();

    // String response
    if (typeof exceptionResponse === 'string') {
      return { message: exceptionResponse };
    }

    // Object response
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;
      const messages = responseObj.message || exception.message;

      // Array ise validation errors
      if (Array.isArray(messages)) {
        return {
          message: 'Validation failed',
          errors: messages,
        };
      }

      // String ise tek mesaj
      if (typeof messages === 'string') {
        return { message: messages };
      }
    }

    // Fallback: exception message
    return { message: exception.message || 'An error occurred' };
  }

  /**
   * Exception'dan user-friendly mesaj oluştur
   */
  static getUserFriendlyMessage(exception: HttpException): string {
    const { message } = this.extractMessageAndErrors(exception);
    return message;
  }

  /**
   * Production ortamında güvenli mesaj döndür
   */
  static getSafeMessage(
    exception: Error,
    defaultMessage: string = 'Internal server error',
  ): string {
    if (process.env.NODE_ENV === 'production') {
      return defaultMessage;
    }
    return exception.message || defaultMessage;
  }
}

