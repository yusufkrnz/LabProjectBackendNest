#!/bin/bash

echo " NestJS Monitoring Stack Başlatılıyor..."

# Docker Compose ile servisleri başlat
echo " Docker servisleri başlatılıyor..."
docker compose up -d

# Servislerin başlatılması için 10 saniye bekle
echo " Servislerin başlatılması için 10 saniye bekleniyor..."
sleep 10

# Servis durumlarını kontrol et
echo " Servis durumları kontrol ediliyor..."
docker compose ps

echo ""
echo " Monitoring stack hazır!"
echo ""
echo " Erişim Bilgileri:"
echo "   • NestJS API: http://localhost:3000"
echo "   • Swagger: http://localhost:3000/api"
echo "   • Metrics: http://localhost:3000/metrics"
echo "   • Grafana: http://localhost:3001 (admin/admin)"
echo "   • Prometheus: http://localhost:9090"
echo ""
echo " Grafana'da 'NestJS Application Overview' dashboard'unu kullanın"
echo " Servisleri durdurmak için: docker compose down"
