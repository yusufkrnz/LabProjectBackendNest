import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseService } from '../services/response.service';
import {
  ExceptionTypeFactory,
  ExceptionMessageUtil,
  MongoErrorUtil,
  RequestIdUtil,
  ExceptionDetectionUtil,
} from '../utils';

/**
 * Global exception filter - Tüm exception'ları yakalar ve standart formatta döner
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  private readonly responseService: ResponseService;

  constructor() {
    this.responseService = new ResponseService();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const path = request.url;

    // Request ID oluştur (trace için)
    const requestId = RequestIdUtil.getOrGenerate(request);

    // Exception kategorisini belirle
    const category = ExceptionDetectionUtil.getExceptionCategory(exception);
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'InternalServerError';
    let errors: string[] | undefined;

    // Exception tipine göre işle
    switch (category) {
      case 'http': {
        const httpException = exception as HttpException;
        status = httpException.getStatus();
        const { message: extractedMessage, errors: extractedErrors } =
          ExceptionMessageUtil.extractMessageAndErrors(httpException);
        message = extractedMessage;
        errors = extractedErrors;
        error = ExceptionTypeFactory.getErrorType(httpException);
        break;
      }

      case 'mongo': {
        status = MongoErrorUtil.getHttpStatus(exception);
        message = MongoErrorUtil.getFormattedMessage(exception);
        error = 'DatabaseError';
        
        // Validation hataları için errors array'i
        const validationErrors = MongoErrorUtil.getValidationErrors(exception);
        if (validationErrors.length > 0) {
          errors = validationErrors;
        }
        break;
      }

      case 'error': {
        const errorException = exception as Error;
        message = ExceptionMessageUtil.getSafeMessage(
          errorException,
          'An unexpected error occurred',
        );
        error = errorException.constructor.name || 'Error';
        
        // Production'da internal error mesajlarını gizle
        if (process.env.NODE_ENV === 'production') {
          message = 'Internal server error';
          error = 'InternalServerError';
        }
        break;
      }

      default: {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'An unknown error occurred';
        error = 'UnknownError';
      }
    }

    // Log hatayı
    this.logError(exception, status, path, requestId);

    // Error response oluştur ve döndür
    const errorResponse = this.responseService.error(
      message,
      status,
      error,
      path,
      errors,
      requestId,
    );

    response.status(status).json(errorResponse);
  }

  /**
   * Hatayı logla
   */
  private logError(
    exception: unknown,
    status: number,
    path: string,
    requestId: string,
  ): void {
    const errorMessage = exception instanceof Error ? exception.message : 'Unknown error';
    const errorStack = exception instanceof Error ? exception.stack : undefined;

    if (status >= 500) {
      // Server errors - detaylı log
      this.logger.error(
        `[${requestId}] ${status} ${path} - ${errorMessage}`,
        errorStack,
        GlobalExceptionFilter.name,
      );
    } else if (status >= 400) {
      // Client errors - warning log
      this.logger.warn(
        `[${requestId}] ${status} ${path} - ${errorMessage}`,
        GlobalExceptionFilter.name,
      );
    }
  }
}

