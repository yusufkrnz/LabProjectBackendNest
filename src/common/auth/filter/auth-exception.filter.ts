import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';


// buraya özel bi helper yazılıp direk çeekeriz
// hata mejajları , message dönüşlerini
//  daha temiz tek tip dönüş iin bi merkez sınıf inşa edilecek

@Catch()
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // 1. HttpException ise status ve message al
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    }

    // 2. Auth hatalarını özel formatla döndür
    if (status === HttpStatus.UNAUTHORIZED) {
      response.status(status).json({
        statusCode: status,
        message: 'Authentication failed',
        error: 'Unauthorized',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }

    if (status === HttpStatus.FORBIDDEN) {
      response.status(status).json({
        statusCode: status,
        message: 'Insufficient permissions',
        error: 'Forbidden',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }

    // 3. Diğer hataları normal formatla döndür
    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}