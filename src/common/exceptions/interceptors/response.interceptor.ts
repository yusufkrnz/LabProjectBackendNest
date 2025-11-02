import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseService } from '../services/response.service';
import { ApiResponseDto } from '../dto/api-response.dto';
import { SKIP_RESPONSE_INTERCEPTOR } from '../decorators/skip-response-interceptor.decorator';

/**
 * Başarılı response'ları standart formata çeviren interceptor
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T>> {
  private readonly responseService: ResponseService;

  constructor(private readonly reflector: Reflector) {
    this.responseService = new ResponseService();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseDto<T>> {
    // Skip decorator kontrolü
    const skipInterceptor = this.reflector.getAllAndOverride<boolean>(
      SKIP_RESPONSE_INTERCEPTOR,
      [context.getHandler(), context.getClass()],
    );

    if (skipInterceptor) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const path = request.url;

    return next.handle().pipe(
      map((data) => {
        // Eğer data zaten ApiResponseDto formatındaysa, olduğu gibi döndür
        if (data && typeof data === 'object' && 'success' in data && 'statusCode' in data) {
          return data as ApiResponseDto<T>;
        }

        // Status code'u response'tan al (default 200)
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode || 200;

        // Varsayılan mesaj belirle
        let message = 'İşlem başarıyla tamamlandı';
        
        // HTTP method'a göre mesaj belirle
        const method = request.method?.toUpperCase();
        if (method === 'POST') {
          message = 'Kayıt başarıyla oluşturuldu';
        } else if (method === 'PUT' || method === 'PATCH') {
          message = 'Kayıt başarıyla güncellendi';
        } else if (method === 'DELETE') {
          message = 'Kayıt başarıyla silindi';
        } else if (method === 'GET') {
          message = 'İşlem başarıyla tamamlandı';
        }

        // Standart response formatına çevir
        return this.responseService.success(data, message, statusCode, path);
      }),
    );
  }
}

