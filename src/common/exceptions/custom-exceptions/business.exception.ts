import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * İş mantığı hataları için custom exception
 */
export class BusinessException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    public readonly code?: string,
  ) {
    super(message, statusCode);
  }
}

