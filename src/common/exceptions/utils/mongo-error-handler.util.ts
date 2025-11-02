import { ConflictException } from 'src/common/exceptions';
import { MongoErrorUtil } from 'src/common/exceptions';

/**
 * MongoDB hatalarını yakala ve custom exception'a çevir
 * Service'lerde try-catch bloklarında kullanılabilir
 */
export function handleMongoError(error: any): never {
  if (MongoErrorUtil.isMongoError(error)) {
    const errorType = MongoErrorUtil.getMongoErrorType(error);
    
    if (errorType === 'duplicate') {
      const field = MongoErrorUtil.getDuplicateKeyField(error);
      throw new ConflictException(
        `${field} already exists`,
        `DUPLICATE_${field?.toUpperCase() || 'KEY'}`,
      );
    }
    
    // Diğer MongoDB hataları için generic error
    const message = MongoErrorUtil.getFormattedMessage(error);
    throw new ConflictException(message, 'MONGO_ERROR');
  }
  
  // MongoDB hatası değilse olduğu gibi fırlat
  throw error;
}

