import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Yetkilendirme hataları için custom exception
 */
export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized access') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

