# 🚀 LabProject Backend NestJS

Bu proje, NestJS framework'ü kullanılarak geliştirilmiş bir backend uygulamasıdır. Modüler, ölçeklenebilir ve bakımı kolay bir yapıya sahiptir.

## 📋 Sprint Genel Bakış

<details>
<summary><h3>🚀 Sprint 1: Temel Yapılandırma ve Kimlik Doğrulama</h3></summary>

Bu sprint'te projenin temel yapısı oluşturuldu, kimlik doğrulama (authentication) ve yetkilendirme (authorization) mekanizmaları entegre edildi.

### 🏗️ Mimari Genel Bakış

Aşağıdaki diyagram, uygulamanın ana modüllerini ve bileşenlerini göstermektedir:

<div style="text-align: center; margin: 20px 0;">
  <img src="media/Architecture.png" alt="NestJS Application Architecture" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
</div>

### 📁 Modül ve Katman Görev Tanımları

<details>
<summary><strong>📁 Common Modülü</strong></summary>
<p>Uygulama genelinde tekrar kullanılan, paylaşımlı bileşenleri içerir. Bu modül, farklı özellik modülleri arasında kod tekrarını önlemek ve merkezi yönetim sağlamak amacıyla tasarlanmıştır.</p>
<ul>
    <li><strong><code>auth/</code>: Kimlik Doğrulama Sistemi</strong>
        <ul>
            <li><code>jwt/</code>: JSON Web Token (JWT) oluşturma, doğrulama ve yönetimi ile ilgili stratejileri ve yardımcıları barındırır.</li>
            <li><code>dto/</code>: Kimlik doğrulama işlemleri için kullanılan Data Transfer Object'leri (DTO) tanımlar (örn. LoginDto, RegisterDto).</li>
            <li><code>filter/</code>: Kimlik doğrulama ve yetkilendirme sırasında oluşabilecek hataları yakalayan ve standart bir yanıt formatında döndüren exception filter'ları içerir.</li>
            <li><code>guards/</code>: Belirli endpoint'lere erişimi kontrol eden yetkilendirme koruyucularını (guards) barındırır (örn. JwtAuthGuard, RolesGuard, GoogleAuthGuard).</li>
            <li><code>middlewares/</code>: Kimlik doğrulama akışında kullanılan özel middleware'leri içerir (örn. RateLimitMiddleware).</li>
            <li><code>utils/</code>: Kimlik doğrulama ile ilgili yardımcı fonksiyonları (örn. şifre hashleme, token işlemleri) barındırır.</li>
        </ul>
    </li>
    <li><strong><code>constants/</code>: Sabit Değerler</strong>
        <ul>
            <li>Uygulama genelinde kullanılan sabit değerleri (örn. JWT sırları, rol isimleri) merkezi bir yerde tutar.</li>
        </ul>
    </li>
    <li><strong><code>decators/</code>: Global Decorator'lar</strong>
        <ul>
            <li>Uygulama genelinde kullanılabilen özel NestJS decorator'larını (örn. <code>@Roles</code>, <code>@Public</code>) tanımlar. Bu decorator'lar, metadataları yöneterek yetkilendirme veya diğer davranışları dinamik olarak kontrol etmeyi sağlar.</li>
        </ul>
    </li>
</ul>
</details>

<details>
<summary><strong>🏥 Health Modülü</strong></summary>
<p>Uygulamanın sağlık durumunu kontrol etmek için bir endpoint sağlar. Özellikle Load Balancer'lar, konteyner orkestrasyon araçları (Docker, Kubernetes) ve izleme sistemleri tarafından uygulamanın çalışır durumda olup olmadığını anlamak için kullanılır.</p>
<ul>
    <li><strong>Amaç:</strong> Sistem sağlığını kontrol eder (load balancer için).</li>
</ul>
</details>

<details>
<summary><strong>🔗 Integration Modülü</strong></summary>
<p>Harici servislerle entegrasyonları yönetmek için ayrılmış bir modüldür. Bu modül, üçüncü taraf API'lerle iletişim kurma veya farklı sistemler arasında veri alışverişi yapma gibi görevleri üstlenebilir.</p>
<ul>
    <li><strong>Amaç:</strong> Harici servis entegrasyonlarını yönetir.</li>
</ul>
</details>

<details>
<summary><strong>🚪 Login Modülü</strong></summary>
<p>Kullanıcı giriş/çıkış akışlarını ve bu akışlarla ilgili özel işlemleri yönetir. Bu modül, kimlik doğrulama (AuthModule) ile entegre çalışarak kullanıcı deneyimini şekillendirir.</p>
<ul>
    <li><strong><code>preLogin/</code>: Giriş Öncesi İşlemler</strong>
        <ul>
            <li>Kullanıcının giriş yapmadan önce gerçekleştirmesi gereken veya giriş ekranında sunulan işlemleri (örn. şifremi unuttum, kayıt ol) içerir.</li>
        </ul>
    </li>
    <li><strong><code>postLogin/</code>: Giriş Sonrası İşlemler</strong>
        <ul>
            <li>Kullanıcı başarılı bir şekilde giriş yaptıktan sonra tetiklenen veya giriş sonrası kullanıcıya özel bilgileri sağlayan işlemleri (örn. kullanıcı profili yükleme, oturum yönetimi) içerir.</li>
        </ul>
    </li>
</ul>
</details>

<details>
<summary><strong>🖼️ Media Modülü</strong></summary>
<p>Uygulamanın medya dosyalarını (resimler, videolar vb.) yükleme, depolama, işleme ve sunma gibi görevlerini yönetir. Dosya yükleme API'leri, depolama entegrasyonları (örn. bulut depolama) bu modülde yer alabilir.</p>
<ul>
    <li><strong>Amaç:</strong> Medya dosyalarını yönetir.</li>
</ul>
</details>

<details>
<summary><strong>📝 Schemas Modülü</strong></summary>
<p>Veritabanı modellerinin (şemalarının) tanımlandığı yerdir. Mongoose gibi ORM'ler kullanılıyorsa, bu modül MongoDB koleksiyonlarının yapısını belirleyen şema dosyalarını içerir.</p>
<ul>
    <li><strong>Amaç:</strong> Veritabanı şemalarını (örn. UserSchema) tanımlar.</li>
</ul>
</details>

<details>
<summary><strong>⚙️ Config Modülü</strong></summary>
<p>Uygulamanın çalışma zamanı yapılandırmasını yönetir. Çevre değişkenlerini (environment variables) okur ve uygulamanın farklı ortamlar (geliştirme, test, üretim) için dinamik olarak yapılandırılmasını sağlar.</p>
<ul>
    <li><strong>Amaç:</strong> Environment değişkenlerini yönetir (.env dosyası).</li>
</ul>
</details>

<details>
<summary><strong>🛠️ Utils Modülü</strong></summary>
<p>Uygulama genelinde kullanılan genel amaçlı yardımcı fonksiyonları ve sınıfları barındırır. Bu fonksiyonlar, belirli bir modüle ait olmayan ancak birçok yerde ihtiyaç duyulan işlemleri (örn. tarih formatlama, string manipülasyonu) gerçekleştirir.</p>
<ul>
    <li><strong>Amaç:</strong> Yardımcı fonksiyonlar sağlar.</li>
</ul>
</details>

<details>
<summary><strong>🚫 Filters Modülü</strong></summary>
<p>Uygulama genelinde meydana gelen hataları yakalayan ve bu hatalara standart bir yanıt formatı uygulayan exception filter'ları içerir. Bu, API'nin tutarlı hata mesajları döndürmesini sağlar.</p>
<ul>
    <li><strong>Amaç:</strong> Global hata yakalama mekanizması sunar.</li>
</ul>
</details>

<details>
<summary><strong>👥 Users Modülü</strong></summary>
<p>Kullanıcı yönetimi ile ilgili tüm iş mantığını ve API endpoint'lerini içerir. Kullanıcı oluşturma, okuma, güncelleme ve silme (CRUD) işlemleri bu modül tarafından yönetilir.</p>
<ul>
    <li><strong>Amaç:</strong> Kullanıcı CRUD işlemlerini ve yönetimini sağlar.</li>
</ul>
</details>

<details>
<summary><strong>📂 Projects Modülü</strong></summary>
<p>Proje yönetimi ile ilgili işlevselliği barındırır. Proje oluşturma, listeleme, güncelleme ve silme gibi operasyonlar bu modül altında toplanır.</p>
<ul>
    <li><strong>Amaç:</strong> Proje yönetimi işlevselliğini sağlar.</li>
</ul>
</details>

<details>
<summary><strong>🧠 Algorithm Modülü</strong></summary>
<p>Uygulamanın çekirdek iş mantığını veya karmaşık hesaplamaları içeren algoritmik işlemleri barındırır. Bu modül, diğer modüller tarafından çağrılabilecek özel algoritmaları veya veri işleme mantığını içerebilir.</p>
<ul>
    <li><strong>Amaç:</strong> Uygulamanın algoritmik ve karmaşık iş mantığını içerir.</li>
</ul>
</details>

### 📸 Sprint 1 Ekran Görüntüleri

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <div style="flex: 1; min-width: 300px;">
    <img src="media/1.png" alt="Sprint 1 - Screenshot 1" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  </div>
  <div style="flex: 1; min-width: 300px;">
    <img src="media/2.png" alt="Sprint 1 - Screenshot 2" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  </div>
</div>

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <div style="flex: 1; min-width: 300px;">
    <img src="media/3.png" alt="Sprint 1 - Screenshot 3" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  </div>
  <div style="flex: 1; min-width: 300px;">
    <img src="media/5.png" alt="Sprint 1 - Screenshot 5" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  </div>
</div>

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <div style="flex: 1; min-width: 300px;">
    <img src="media/6.png" alt="Sprint 1 - Screenshot 6" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  </div>
  <div style="flex: 1; min-width: 300px;">
    <img src="media/7.png" alt="Sprint 1 - Screenshot 7" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  </div>
</div>

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <div style="flex: 1; min-width: 300px;">
    <img src="media/8.png" alt="Sprint 1 - Screenshot 8" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  </div>
  <div style="flex: 1; min-width: 300px;">
    <img src="media/9.png" alt="Sprint 1 - Screenshot 9" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  </div>
</div>

### ✅ Completed Features
- [x] User registration with validation
- [x] JWT-based authentication
- [x] Role-based access control (Admin/User)
- [x] Refresh token mechanism
- [x] Swagger API documentation
- [x] Password hashing with bcrypt
- [x] MongoDB integration
- [x] Error handling and validation

### 🛠️ Technical Stack
- **Backend:** NestJS, TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, Passport.js
- **Documentation:** Swagger/OpenAPI
- **Security:** bcrypt, HttpOnly cookies

### 🔧 Key Components
- `AuthModule` - Centralized authentication
- `UsersModule` - User management
- `PreloginModule` - Pre-authentication operations
- `PostloginModule` - Post-authentication operations
- `RolesGuard` - Role-based access control
- `JwtAuthGuard` - JWT token validation

</details>

<details>
<summary><h3>🚀 Sprint 2 - Coming Soon</h3></summary>

</details>

<details>
<summary><h3>🚀 Sprint 3 - Future Development</h3></summary>

</details>