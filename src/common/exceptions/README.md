# Global Exception Handling & Response Formatting

Bu modül, uygulama genelinde tutarlı exception handling ve response formatting sağlar.

## 📁 Klasör Yapısı

```
common/exceptions/
├── dto/                          # Response DTO'ları
│   ├── api-response.dto.ts      # Başarılı response formatı
│   └── error-response.dto.ts    # Hata response formatı
├── filters/                      # Exception filter'lar
│   └── global-exception.filter.ts  # Global exception handler
├── interceptors/                 # Response interceptor'lar
│   └── response.interceptor.ts   # Başarılı response formatlayıcı
├── custom-exceptions/            # Custom exception sınıfları
│   ├── business.exception.ts
│   ├── conflict.exception.ts
│   └── unauthorized.exception.ts
├── services/                     # Helper servisler
│   └── response.service.ts       # Response formatlama servisi
├── utils/                        # Utility fonksiyonlar (Factory Pattern)
│   ├── exception-type.factory.ts    # Exception tipi factory
│   ├── exception-message.util.ts    # Exception mesaj extractor
│   ├── mongo-error.util.ts          # MongoDB hata handler
│   ├── request-id.util.ts           # Request ID generator
│   └── exception-detection.util.ts  # Exception detection
├── decorators/                   # Decorator'lar
│   └── skip-response-interceptor.decorator.ts
├── exceptions.module.ts          # Modül tanımı
└── index.ts                      # Export dosyası
```

## 🚀 Özellikler

### 1. Standart Response Formatı

**Başarılı Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "İşlem başarıyla tamamlandı",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/users"
}
```

**Hata Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "error": "BadRequestException",
  "errors": ["username must be longer than or equal to 3 characters"],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/users",
  "requestId": "req-123456789"
}
```

### 2. Factory Pattern ile Exception Handling

Yeni exception tipleri eklemek için factory pattern kullanılır:

```typescript
import { ExceptionTypeFactory } from 'src/common/exceptions';
import { MyCustomException } from './my-custom.exception';

// Yeni exception tipi kaydet
ExceptionTypeFactory.registerExceptionType(MyCustomException, 'MyCustomException');

// Veya birden fazla tip ekle
ExceptionTypeFactory.registerExceptionTypes([
  { ExceptionClass: MyCustomException, errorType: 'MyCustomException' },
  { ExceptionClass: AnotherException, errorType: 'AnotherException' },
]);
```

### 3. Utility Fonksiyonlar (Kod Tekrarını Önlemek İçin)

#### Exception Message Extraction
```typescript
import { ExceptionMessageUtil } from 'src/common/exceptions';

const { message, errors } = ExceptionMessageUtil.extractMessageAndErrors(exception);
const safeMessage = ExceptionMessageUtil.getSafeMessage(exception, 'Default message');
```

#### MongoDB Error Handling
```typescript
import { MongoErrorUtil } from 'src/common/exceptions';

if (MongoErrorUtil.isMongoError(exception)) {
  const status = MongoErrorUtil.getHttpStatus(exception);
  const message = MongoErrorUtil.getFormattedMessage(exception);
  const field = MongoErrorUtil.getDuplicateKeyField(exception);
  const errors = MongoErrorUtil.getValidationErrors(exception);
}
```

#### Request ID Generation
```typescript
import { RequestIdUtil } from 'src/common/exceptions';

const requestId = RequestIdUtil.generate();
const shortId = RequestIdUtil.generateShort();
const uuid = RequestIdUtil.generateUUID();
const id = RequestIdUtil.getOrGenerate(request);
```

#### Exception Detection
```typescript
import { ExceptionDetectionUtil } from 'src/common/exceptions';

const category = ExceptionDetectionUtil.getExceptionCategory(exception);
// 'http' | 'mongo' | 'error' | 'unknown'

const isHttp = ExceptionDetectionUtil.isHttpException(exception);
const isMongo = ExceptionDetectionUtil.isMongoError(exception);
const status = ExceptionDetectionUtil.extractHttpStatus(exception);
```

### 4. Global Exception Handling

Tüm exception'lar otomatik olarak yakalanır ve standart formata çevrilir:
- HTTP Exception'lar (BadRequest, NotFound, Unauthorized, vb.)
- MongoDB/Mongoose hataları (Duplicate key, Validation, Cast errors)
- Validation hataları (detaylı error listesi ile)
- Custom exception'lar
- Beklenmeyen hatalar (Error, TypeError, vb.)

### 5. Otomatik Response Formatting

Tüm başarılı response'lar otomatik olarak standart formata çevrilir. HTTP method'una göre otomatik mesaj atanır:
- `POST` → "Kayıt başarıyla oluşturuldu"
- `PUT/PATCH` → "Kayıt başarıyla güncellendi"
- `DELETE` → "Kayıt başarıyla silindi"
- `GET` → "İşlem başarıyla tamamlandı"

### 6. Custom Exception'lar

```typescript
import { BusinessException, ConflictException } from 'src/common/exceptions';

// İş mantığı hatası
throw new BusinessException('Geçersiz işlem', HttpStatus.BAD_REQUEST, 'INVALID_OPERATION');

// Çakışma (duplicate kayıt)
throw new ConflictException('Username already exists', 'DUPLICATE_USERNAME');
```

### 7. Response Interceptor'ı Bypass Etme

Bazı endpoint'lerde standart response formatını kullanmak istemiyorsanız:

```typescript
import { SkipResponseInterceptor } from 'src/common/exceptions';

@SkipResponseInterceptor()
@Get('raw')
getRawData() {
  return { custom: 'format' };
}
```

### 8. Manuel Response Formatlama

Controller'da manuel olarak formatlamak isterseniz:

```typescript
import { ResponseService } from 'src/common/exceptions';

@Controller('users')
export class UsersController {
  constructor(private readonly responseService: ResponseService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const data = await this.usersService.findAll();
    return this.responseService.success(data, 'Kullanıcılar başarıyla getirildi', 200, req.url);
  }
}
```

## 📝 Kullanım Örnekleri

### Controller'da Kullanım

```typescript
import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    
    return user; // Otomatik olarak standart formata çevrilir
  }
}
```

### Service'te Kullanım

```typescript
import { Injectable } from '@nestjs/common';
import { ConflictException, BusinessException } from 'src/common/exceptions';

@Injectable()
export class UsersService {
  async createUser(username: string) {
    const existingUser = await this.userModel.findOne({ username });
    
    if (existingUser) {
      throw new ConflictException('Username already exists', 'DUPLICATE_USERNAME');
    }
    
    return this.userModel.create({ username });
  }

  async processBusinessLogic(data: any) {
    if (!data.isValid) {
      throw new BusinessException('Invalid business data', HttpStatus.BAD_REQUEST, 'INVALID_DATA');
    }
  }
}
```

### Utility Fonksiyonlar ile Özel Exception Handling

```typescript
import { MongoErrorUtil, ExceptionMessageUtil } from 'src/common/exceptions';

try {
  await this.userModel.create(userData);
} catch (error) {
  if (MongoErrorUtil.isMongoError(error)) {
    const status = MongoErrorUtil.getHttpStatus(error);
    const message = MongoErrorUtil.getFormattedMessage(error);
    
    if (MongoErrorUtil.getMongoErrorType(error) === 'duplicate') {
      const field = MongoErrorUtil.getDuplicateKeyField(error);
      throw new ConflictException(`${field} already exists`);
    }
  }
  throw error;
}
```

## 🔧 Konfigürasyon

Modül `AppModule`'e otomatik olarak eklenmiştir ve global olarak çalışır:

```typescript
// app.module.ts
import { ExceptionsModule } from './common/exceptions/exceptions.module';

@Module({
  imports: [
    // ...
    ExceptionsModule, // Global olarak aktif
  ],
})
export class AppModule {}
```

## 🎯 Yeni Exception Tipi Ekleme

Factory pattern sayesinde yeni exception tipleri kolayca eklenebilir:

```typescript
// 1. Custom exception oluştur
export class PaymentException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.PAYMENT_REQUIRED);
    this.name = 'PaymentException';
  }
}

// 2. Factory'ye kaydet (app.module.ts veya main.ts'te)
import { ExceptionTypeFactory } from 'src/common/exceptions';
import { PaymentException } from './payment.exception';

ExceptionTypeFactory.registerExceptionType(PaymentException, 'PaymentException');

// 3. Kullan
throw new PaymentException('Payment required');
```

## 📊 Logging

- **4xx hatalar**: Warning seviyesinde loglanır
- **5xx hatalar**: Error seviyesinde loglanır (stack trace ile)
- Her hata için `requestId` üretilir (trace için)

## 🎯 MongoDB Hata Handling

MongoDB hataları otomatik olarak yakalanır ve uygun HTTP status code'larına çevrilir:
- `Duplicate key (11000)` → `409 Conflict`
- `Validation error` → `400 Bad Request`
- `Cast error` → `400 Bad Request`

## ⚠️ Önemli Notlar

1. Response interceptor, tüm başarılı response'ları otomatik olarak formatlar
2. Exception filter, tüm hataları yakalar ve standart formata çevirir
3. Production ortamında internal error mesajları gizlenir (güvenlik için)
4. Request ID her hata için otomatik oluşturulur (trace için)
5. Factory pattern sayesinde yeni exception tipleri kolayca eklenebilir (kod tekrarı yok)
6. Utility fonksiyonlar kod tekrarını önler ve yeniden kullanılabilir helper'lar sağlar

## 🏗️ Mimari

### Factory Pattern
- `ExceptionTypeFactory`: Exception tipine göre error string belirleme
- Yeni exception tipleri kolayca eklenebilir
- Kod tekrarı yok, maintainable yapı

### Utility Functions
- `ExceptionMessageUtil`: Exception mesajlarını extract etme
- `MongoErrorUtil`: MongoDB hata handling
- `RequestIdUtil`: Request ID generation
- `ExceptionDetectionUtil`: Exception detection ve classification

### Clean Code Principles
- Single Responsibility: Her utility tek bir sorumluluğa sahip
- DRY (Don't Repeat Yourself): Kod tekrarı yok
- Open/Closed: Yeni exception tipleri eklemek için kod değişikliği gerekmez
- Separation of Concerns: Her katman kendi sorumluluğuna odaklanır


