# Auth Module - Yetkilendirme Sistemi

Bu modül NestJS tabanlı güvenli kimlik doğrulama ve yetkilendirme sistemidir.

## 📁 Klasör Yapısı

```
auth/
├── auth.module.ts          # Ana modül (JWT, Strategy, Guard'ları birleştirir)
├── auth.controller.ts      # HTTP endpoint'leri (login/register/refresh/logout)
├── auth.service.ts         # İş mantığı merkezi (token üretimi, doğrulama)
├── dto/                    # Veri transfer nesneleri
│   ├── register.dto.ts     # Kayıt formu validasyonu
│   ├── login.dto.ts        # Giriş formu validasyonu
│   └── refresh.dto.ts      # Token yenileme validasyonu
├── jwt/                    # Token yönetimi
│   ├── jwt.strategy.ts     # Access token doğrulama
│   ├── jwt.guard.ts        # Protected endpoint koruması
│   ├── jwt.service.ts      # Token üretim/doğrulama
│   ├── local.strategy.ts   # Username/password doğrulama
│   └── refresh.strategy.ts # Refresh token doğrulama
├── guards/                 # Endpoint koruma katmanı
│   ├── roles.guard.ts      # RBAC (rol tabanlı yetkilendirme)
│   └── refresh-token.guard.ts # Refresh endpoint koruması
├── utils/                  # Yardımcı fonksiyonlar
│   ├── password.util.ts    # Şifre hash/doğrulama
│   └── cookie.util.ts      # Cookie yönetimi
├── middlewares/            # İstek işleme katmanı
│   └── rate-limit.middleware.ts # Brute force koruması
└── filter/                 # Hata yönetimi
    └── auth-exception.filter.ts # Auth hatalarını yakalama
```

## 🔐 Güvenlik Katmanları

### 1. Rate Limiting (Middleware)
- Login/refresh endpoint'lerinde brute force koruması
- IP bazlı sınırlama (örn: 5 deneme/15 dakika)
- Redis/Memory cache ile sayaç tutma

### 2. Authentication (Strategy + Guard)
- **LocalStrategy**: Username/password doğrulama
- **JwtStrategy**: Bearer token doğrulama
- **RefreshStrategy**: Refresh token doğrulama
- Guard'lar endpoint'leri korur

### 3. Authorization (RBAC)
- **RolesGuard**: Rol tabanlı erişim kontrolü
- `@Roles(Role.Admin)` decorator ile kullanım
- request.user.roles ile metadata karşılaştırması

### 4. Token Management
- **Access Token**: 5-15 dakika TTL, Bearer header
- **Refresh Token**: 7-30 gün TTL, HttpOnly cookie
- **Token Rotasyonu**: Her refresh'te yeni token üretimi
- **Revocation**: Logout'ta token geçersizleştirme

## 🔄 Akış Diyagramı

```
[Register] POST /auth/register
    ↓
[AuthController] → [AuthService] → [UsersService.createUser()]
    ↓
[Response] User created

---

[Login] POST /auth/login
    ↓
[AuthController] → [LocalStrategy] → [AuthService.validatePassword()]
    ↓
[AuthService] → [JwtAuthService.generateTokens()]
    ↓
[AuthService] → [UsersService.setRefreshTokenHash()]
    ↓
[Response] Access token (header) + Refresh token (cookie)

---

[Protected] GET /protected + Bearer token
    ↓
[Controller] @UseGuards(JwtAuthGuard, RolesGuard)
    ↓
[JwtStrategy] → [JwtAuthService.verify()] → request.user doldur
    ↓
[RolesGuard] → @Roles() metadata ile request.user.roles karşılaştır
    ↓
[Controller] İş mantığı

---

[Refresh] POST /auth/refresh + refresh token
    ↓
[AuthController] → [RefreshTokenGuard] → [RefreshStrategy]
    ↓
[AuthService] → [JwtAuthService.verify()] → [UsersService] hash karşılaştır
    ↓
[AuthService] → [JwtAuthService.generateTokens()] → rotasyon
    ↓
[UsersService] → setRefreshTokenHash() → eski token geçersiz
    ↓
[Response] Yeni access + yeni refresh

---

[Logout] POST /auth/logout
    ↓
[AuthController] → [AuthService] → [UsersService.clearRefreshTokenHash()]
    ↓
[Response] Refresh cookie temizle
```

## 🛠 Kullanım

### Controller'da Guard Kullanımı
```typescript
@Controller('users')
export class UsersController {
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findAll() {
    // Sadece Admin rolü erişebilir
  }
}
```

### Swagger Entegrasyonu
```typescript
// main.ts
const config = new DocumentBuilder()
  .addBearerAuth()
  .build();

// Controller'da
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
async protectedEndpoint() {}
```

## ⚙️ Konfigürasyon

### Environment Variables
```env
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```

### Module Import
```typescript
// app.module.ts
@Module({
  imports: [AuthModule],
})
export class AppModule {}
```

## 🔧 Eksik Sınıflar (Implement Edilecek)

- ✅ **Mevcut**: jwt.strategy.ts, jwt.guard.ts, jwt.service.ts
- ❌ **Eksik**: auth.module.ts, auth.controller.ts, auth.service.ts (düzenle)
- ❌ **Eksik**: local.strategy.ts, refresh.strategy.ts
- ❌ **Eksik**: roles.guard.ts, refresh-token.guard.ts
- ❌ **Eksik**: password.util.ts, cookie.util.ts
- ❌ **Eksik**: rate-limit.middleware.ts, auth-exception.filter.ts
- ❌ **Eksik**: register.dto.ts, login.dto.ts, refresh.dto.ts (doldur)

## 🚀 Öncelik Sırası

1. **AuthModule** - Tüm bileşenleri birleştir
2. **AuthController** - Endpoint'leri tanımla
3. **AuthService** - İş mantığını tamamla
4. **DTO'lar** - Validasyon ve Swagger
5. **LocalStrategy** - Login akışı
6. **RolesGuard** - RBAC
7. **Utils** - Yardımcı fonksiyonlar
8. **Middleware/Filter** - Güvenlik katmanları

## 📝 Notlar

- Mevcut `auth.service.ts` aslında `UsersService` - yeniden adlandırılmalı
- `common/decators/roles` altındaki guard'lar buraya taşınabilir
- Token rotasyonu zorunlu - güvenlik için
- Web'de refresh token HttpOnly cookie, API'de header
- Rate limiting production'da mutlaka aktif olmalı


