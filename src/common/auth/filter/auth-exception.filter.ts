/**
 * @deprecated Bu filter artık kullanılmamalıdır.
 * Global exception filter (GlobalExceptionFilter) tüm exception'ları handle ediyor.
 * Bu dosya sadece referans için tutulmaktadır ve yakında kaldırılacaktır.
 * 
 * Lütfen bunun yerine global exception handling sistemini kullanın:
 * - Tüm exception'lar otomatik olarak GlobalExceptionFilter tarafından yakalanır
 * - Custom exception'lar için: src/common/exceptions/custom-exceptions kullanın
 */

import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

/**
 * @deprecated Bu filter artık kullanılmamalıdır.
 * GlobalExceptionFilter kullanılmalıdır.
 */
@Catch()
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Bu filter artık kullanılmamalıdır
    // GlobalExceptionFilter tüm exception'ları handle ediyor
    // Bu dosya sadece backward compatibility için tutulmaktadır
    throw new Error('This filter is deprecated. Use GlobalExceptionFilter instead.');
  }
}
