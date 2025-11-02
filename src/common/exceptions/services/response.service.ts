import { Injectable } from '@nestjs/common';
import { ApiResponseDto } from '../dto/api-response.dto';
import { ErrorResponseDto } from '../dto/error-response.dto';

/**
 * Response formatlamak için helper service
 */
@Injectable()
export class ResponseService {
  /**
   * Başarılı response formatla
   */
  success<T>(
    data: T,
    message: string = 'İşlem başarıyla tamamlandı',
    statusCode: number = 200,
    path: string = '/',
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
      path,
    });
  }

  /**
   * Hata response formatla
   */
  error(
    message: string,
    statusCode: number,
    error: string,
    path: string = '/',
    errors?: string[],
    requestId?: string,
  ): ErrorResponseDto {
    return new ErrorResponseDto({
      success: false,
      statusCode,
      message,
      error,
      errors,
      timestamp: new Date().toISOString(),
      path,
      requestId,
    });
  }
}

