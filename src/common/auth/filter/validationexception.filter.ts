/**
 * @deprecated Bu filter artık kullanılmamalıdır.
 * Global exception filter (GlobalExceptionFilter) validation exception'larını da handle ediyor.
 * Bu dosya sadece referans için tutulmaktadır ve yakında kaldırılacaktır.
 * 
 * Lütfen bunun yerine global exception handling sistemini kullanın:
 * - Validation hataları otomatik olarak GlobalExceptionFilter tarafından yakalanır
 * - Standart response formatı otomatik olarak uygulanır
 */

import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';

/**
 * @deprecated Bu filter artık kullanılmamalıdır.
 * GlobalExceptionFilter kullanılmalıdır.
 */
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    // Bu filter artık kullanılmamalıdır
    // GlobalExceptionFilter validation exception'larını da handle ediyor
    // Bu dosya sadece backward compatibility için tutulmaktadır
    throw new Error('This filter is deprecated. Use GlobalExceptionFilter instead.');
  }
}
