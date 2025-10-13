import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    
    // 1. Validation hatalarını düzenle
    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      const messages = Array.isArray(exceptionResponse.message) 
        ? exceptionResponse.message 
        : [exceptionResponse.message];

      response.status(status).json({
        statusCode: status,
        message: 'Validation failed',
        errors: messages,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }

    // 2. Diğer BadRequest hatalarını normal döndür
    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}