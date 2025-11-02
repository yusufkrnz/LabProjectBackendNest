import { HttpStatus } from '@nestjs/common';

/**
 * MongoDB/Mongoose hata handling için helper fonksiyonlar
 */
export class MongoErrorUtil {
  /**
   * MongoDB hata mı kontrol et
   */
  static isMongoError(exception: any): boolean {
    return (
      exception?.name === 'MongoError' ||
      exception?.name === 'MongoServerError' ||
      exception?.name === 'ValidationError' ||
      exception?.name === 'CastError' ||
      exception?.code === 11000 || // Duplicate key error
      exception?.codeName === 'DuplicateKey' ||
      exception?.code === 11001 // Duplicate key error (alternatif)
    );
  }

  /**
   * MongoDB hata tipini belirle
   */
  static getMongoErrorType(exception: any): 'duplicate' | 'validation' | 'cast' | 'unknown' {
    if (exception?.code === 11000 || exception?.code === 11001 || exception?.codeName === 'DuplicateKey') {
      return 'duplicate';
    }
    if (exception?.name === 'ValidationError') {
      return 'validation';
    }
    if (exception?.name === 'CastError') {
      return 'cast';
    }
    return 'unknown';
  }

  /**
   * MongoDB hata durumunu HTTP status code'a çevir
   */
  static getHttpStatus(exception: any): HttpStatus {
    const errorType = this.getMongoErrorType(exception);

    switch (errorType) {
      case 'duplicate':
        return HttpStatus.CONFLICT;
      case 'validation':
        return HttpStatus.BAD_REQUEST;
      case 'cast':
        return HttpStatus.BAD_REQUEST;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  /**
   * MongoDB hata mesajını formatla
   */
  static getFormattedMessage(exception: any): string {
    const errorType = this.getMongoErrorType(exception);

    switch (errorType) {
      case 'duplicate': {
        const key = Object.keys(exception.keyPattern || {})[0];
        return key ? `${key} already exists` : 'Duplicate key error';
      }
      case 'validation': {
        const errors = Object.values(exception.errors || {}).map(
          (err: any) => err.message,
        );
        return errors.length > 0 ? errors.join(', ') : 'Validation error';
      }
      case 'cast': {
        return `Invalid ${exception.path || 'field'}`;
      }
      default:
        return exception?.message || 'Database error occurred';
    }
  }

  /**
   * MongoDB duplicate key hatası için field name'i extract et
   */
  static getDuplicateKeyField(exception: any): string | null {
    if (this.getMongoErrorType(exception) === 'duplicate') {
      const keys = Object.keys(exception.keyPattern || {});
      return keys.length > 0 ? keys[0] : null;
    }
    return null;
  }

  /**
   * MongoDB validation hatalarını array olarak döndür
   */
  static getValidationErrors(exception: any): string[] {
    if (this.getMongoErrorType(exception) === 'validation') {
      return Object.values(exception.errors || {}).map(
        (err: any) => err.message,
      );
    }
    return [];
  }
}

