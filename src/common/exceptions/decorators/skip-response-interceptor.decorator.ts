import { SetMetadata } from '@nestjs/common';

/**
 * Response interceptor'ı bypass etmek için kullanılacak decorator
 * Bazı endpoint'lerde standart response formatını kullanmak istemiyorsanız bu decorator'ı kullanın
 * 
 * @example
 * @SkipResponseInterceptor()
 * @Get('raw')
 * getRawData() {
 *   return { custom: 'format' };
 * }
 */
export const SKIP_RESPONSE_INTERCEPTOR = 'skipResponseInterceptor';
export const SkipResponseInterceptor = () => SetMetadata(SKIP_RESPONSE_INTERCEPTOR, true);

