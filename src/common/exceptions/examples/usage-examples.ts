import { Injectable } from '@nestjs/common';
import {
  ExceptionTypeFactory,
  MongoErrorUtil,
  ExceptionDetectionUtil,
} from 'src/common/exceptions';

/**
 * Örnek: Yeni bir custom exception tipi ekleme ve kullanma
 */
@Injectable()
export class ExampleService {
  /**
   * Örnek: Yeni exception tipi kaydetme (genellikle app.module.ts veya main.ts'te yapılır)
   */
  static registerCustomExceptions() {
    // Örnek: PaymentException ekle
    // ExceptionTypeFactory.registerExceptionType(PaymentException, 'PaymentException');
  }

  /**
   * Örnek: MongoDB hata handling
   */
  async handleMongoError(error: any) {
    if (MongoErrorUtil.isMongoError(error)) {
      const errorType = MongoErrorUtil.getMongoErrorType(error);
      const status = MongoErrorUtil.getHttpStatus(error);
      const message = MongoErrorUtil.getFormattedMessage(error);

      if (errorType === 'duplicate') {
        const field = MongoErrorUtil.getDuplicateKeyField(error);
        console.log(`Duplicate key on field: ${field}`);
      }

      if (errorType === 'validation') {
        const errors = MongoErrorUtil.getValidationErrors(error);
        console.log(`Validation errors:`, errors);
      }

      return { status, message };
    }
  }

  /**
   * Örnek: Exception detection
   */
  handleException(exception: unknown) {
    const category = ExceptionDetectionUtil.getExceptionCategory(exception);

    switch (category) {
      case 'http':
        console.log('HTTP Exception detected');
        break;
      case 'mongo':
        console.log('MongoDB Exception detected');
        break;
      case 'error':
        console.log('Generic Error detected');
        break;
      default:
        console.log('Unknown exception type');
    }
  }
}

