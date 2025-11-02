import {
  HttpException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  PayloadTooLargeException,
  RequestTimeoutException,
  InternalServerErrorException,
  NotImplementedException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
} from '@nestjs/common';
import { BusinessException } from '../custom-exceptions/business.exception';

/**
 * Exception tipine göre error string belirleme için factory
 */
export class ExceptionTypeFactory {
  private static readonly exceptionTypeMap = new Map<
    new (...args: any[]) => HttpException,
    string
  >([
    [BadRequestException, 'BadRequestException'],
    [UnauthorizedException, 'UnauthorizedException'],
    [ForbiddenException, 'ForbiddenException'],
    [NotFoundException, 'NotFoundException'],
    [ConflictException, 'ConflictException'],
    [UnprocessableEntityException, 'UnprocessableEntityException'],
    [PayloadTooLargeException, 'PayloadTooLargeException'],
    [RequestTimeoutException, 'RequestTimeoutException'],
    [InternalServerErrorException, 'InternalServerErrorException'],
    [NotImplementedException, 'NotImplementedException'],
    [BadGatewayException, 'BadGatewayException'],
    [ServiceUnavailableException, 'ServiceUnavailableException'],
    [GatewayTimeoutException, 'GatewayTimeoutException'],
    [BusinessException, 'BusinessException'],
  ]);

  /**
   * Exception tipine göre error string döndür
   */
  static getErrorType(exception: HttpException): string {
    // Map'ten kontrol et
    for (const [ExceptionClass, errorType] of this.exceptionTypeMap.entries()) {
      if (exception instanceof ExceptionClass) {
        return errorType;
      }
    }

    // Fallback: constructor name (otomatik, kod tekrarı yok)
    return exception.constructor.name || 'HttpException';
  }

  /**
   * Yeni exception tipi ekle
   */
  static registerExceptionType(
    ExceptionClass: new (...args: any[]) => HttpException,
    errorType: string,
  ): void {
    this.exceptionTypeMap.set(ExceptionClass, errorType);
  }

  /**
   * Birden fazla exception tipi ekle
   */
  static registerExceptionTypes(
    types: Array<{
      ExceptionClass: new (...args: any[]) => HttpException;
      errorType: string;
    }>,
  ): void {
    types.forEach(({ ExceptionClass, errorType }) => {
      this.exceptionTypeMap.set(ExceptionClass, errorType);
    });
  }
}

