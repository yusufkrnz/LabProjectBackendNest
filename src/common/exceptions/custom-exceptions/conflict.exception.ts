import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Çakışma durumları için custom exception (örn: duplicate kayıt)
 */
export class ConflictException extends HttpException {
  constructor(message: string, public readonly code?: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

