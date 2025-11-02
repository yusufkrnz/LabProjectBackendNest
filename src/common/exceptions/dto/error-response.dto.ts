import { ApiProperty } from '@nestjs/swagger';

/**
 * Standart hata response formatı
 * 
 * @example
 * ```typescript
 * const errorResponse = new ErrorResponseDto({
 *   success: false,
 *   statusCode: 400,
 *   message: 'Validation failed',
 *   error: 'BadRequestException',
 *   errors: ['username must be at least 3 characters'],
 *   timestamp: new Date().toISOString(),
 *   path: '/api/users',
 *   requestId: 'req-123456789'
 * });
 * ```
 */
export class ErrorResponseDto {
  @ApiProperty({
    description: 'İşlem başarılı mı?',
    example: false,
    type: Boolean,
  })
  readonly success: boolean;

  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
    type: Number,
    minimum: 400,
    maximum: 599,
  })
  readonly statusCode: number;

  @ApiProperty({
    description: 'Hata mesajı',
    example: 'Validation failed',
    type: String,
  })
  readonly message: string;

  @ApiProperty({
    description: 'Hata tipi (Exception class adı)',
    example: 'BadRequestException',
    type: String,
  })
  readonly error: string;

  @ApiProperty({
    description: 'Detaylı hata mesajları (validation hataları için)',
    example: ['username must be longer than or equal to 3 characters'],
    type: [String],
    required: false,
    nullable: true,
  })
  readonly errors?: string[];

  @ApiProperty({
    description: 'Hata zamanı (ISO 8601 formatında)',
    example: '2024-01-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  readonly timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: '/api/users',
    type: String,
  })
  readonly path: string;

  @ApiProperty({
    description: 'Request ID (trace ve log takibi için)',
    example: 'req-123456789',
    type: String,
    required: false,
    nullable: true,
  })
  readonly requestId?: string;

  constructor(partial: Partial<ErrorResponseDto>) {
    Object.assign(this, partial);
  }
}

