<h1>Constants klasörünün temel felsefesi</h1>

<h2>Örnek</h2>
<h3>Bir auth sistemi var.
Kullanıcı login olunca JWT oluşturuyoruz.

JWT oluşturmak için bize 3 sabit lazım:

token süresi

issuer bilgisi

secret key

Bu değerleri ister kodun içine gömebiliriz (kötü yöntem),
ister constants içine taşıyabiliriz (iyi yöntem).</h3>