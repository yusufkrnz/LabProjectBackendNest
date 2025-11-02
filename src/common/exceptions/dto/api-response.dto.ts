import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

/**
 * Standart başarılı API response formatı
 * 
 * @template T - Response data tipi (default: unknown)
 * 
 * @example
 * ```typescript
 * const response = new ApiResponseDto<User>({
 *   success: true,
 *   statusCode: 200,
 *   message: 'User found',
 *   data: user,
 *   timestamp: new Date().toISOString(),
 *   path: '/api/users/1'
 * });
 * ```
 */
export class ApiResponseDto<T = unknown> {
  @ApiProperty({
    description: 'İşlem başarılı mı?',
    example: true,
    type: Boolean,
  })
  readonly success: boolean;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
    type: Number,
    minimum: 100,
    maximum: 599,
  })
  readonly statusCode: number;

  @ApiProperty({
    description: 'Response mesajı',
    example: 'İşlem başarıyla tamamlandı',
    type: String,
  })
  readonly message: string;

  @ApiProperty({
    description: 'Response data',
    example: null,
    // Generic type için Swagger'da Object olarak gösterilir
    type: Object,
  } as ApiPropertyOptions)
  readonly data: T;

  @ApiProperty({
    description: 'İşlem zamanı (ISO 8601 formatında)',
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

  constructor(partial: Partial<ApiResponseDto<T>>) {
    Object.assign(this, partial);
  }
}

