import { HttpStatus, HttpException } from '@nestjs/common';
import { MongoErrorUtil } from './mongo-error.util';

/**
 * Exception detection ve classification için utility fonksiyonlar
 */
export class ExceptionDetectionUtil {
  /**
   * Exception tipini belirle
   */
  static getExceptionCategory(exception: unknown): 'http' | 'mongo' | 'error' | 'unknown' {
    if (this.isHttpException(exception)) {
      return 'http';
    }
    if (this.isMongoError(exception)) {
      return 'mongo';
    }
    if (exception instanceof Error) {
      return 'error';
    }
    return 'unknown';
  }

  /**
   * HttpException mı kontrol et
   */
  static isHttpException(exception: unknown): boolean {
    // Doğrudan type guard
    if (exception instanceof HttpException) return true;
    // Fallback: yapısal kontrol
    return (
      exception !== null &&
      typeof exception === 'object' &&
      'getStatus' in exception &&
      'getResponse' in exception
    );
  }

  /**
   * MongoDB hata mı kontrol et
   */
  static isMongoError(exception: any): boolean {
    return (
      exception?.name === 'MongoError' ||
      exception?.name === 'MongoServerError' ||
      exception?.name === 'ValidationError' ||
      exception?.name === 'CastError' ||
      exception?.code === 11000 ||
      exception?.code === 11001 ||
      exception?.codeName === 'DuplicateKey'
    );
  }

  /**
   * Error instance mı kontrol et
   */
  static isError(exception: unknown): boolean {
    return exception instanceof Error;
  }

  /**
   * Exception'dan HTTP status code çıkar
   */
  static extractHttpStatus(exception: unknown): HttpStatus {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    // MongoDB hataları için
    if (this.isMongoError(exception)) {
      return MongoErrorUtil.getHttpStatus(exception);
    }

    // Default: Internal Server Error
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

