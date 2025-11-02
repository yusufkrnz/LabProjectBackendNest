import { Module, Global } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { ResponseService } from './services/response.service';
import { Reflector } from '@nestjs/core';

/**
 * Global exceptions module
 * Tüm uygulamada geçerli exception handling ve response formatting
 */
@Global()
@Module({
  providers: [
    ResponseService,
    Reflector,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
  exports: [ResponseService],
})
export class ExceptionsModule {}

