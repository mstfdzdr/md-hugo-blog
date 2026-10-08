---
title: "Nöbet Çizelgem"
description: "Vardiyalı çalışanların nöbet çizelgelerini kolayca takip edebilmeleri için ücretsiz mobil uygulama."
weight: 1
# Publish only the resized screenshots, not the originals
build:
  publishResources: false
platforms: ["Android", "iOS"]
links:
  appStore: "https://apps.apple.com/tr/app/hem%C5%9Fire-n%C3%B6bet-%C3%A7izelgem/id6476260555"
  googlePlay: "https://play.google.com/store/apps/details?id=com.dizdardev.hemsirenobetcizelgem"
# App icon: put icon.png in this folder.
# Screenshots: put images in the screenshots/ folder; they are shown in a gallery.
---

**Nöbet Çizelgem**, vardiyalı çalışanların nöbet çizelgelerini kolayca takip edebilmeleri için geliştirilmiş ücretsiz bir mobil uygulamadır. Uygulama, kullanıcıların farklı vardiya türlerini takvim üzerinde görsel olarak işaretlemelerine ve aylık toplam çalışma saatlerini hesaplamalarına yardımcı olur.

## ✨ Özellikler

### 📅 Nöbet Yönetimi
- **Görsel Takvim**: Aylık nöbet çizelgesi görünümü
- **Nöbet Türleri**: 
  - 🌞 8-16 (8 Saat - Gündüz)
  - 🌚 16-8 (16 Saat - Gece)
  - 🌞🌚 8-8 (24 Saat - Tam Gün)
  - 🌞🌞 8-24 (16 Saat - İkili Gündüz)
  - 🌚🌚 16-24 (8 Saat - İkili Gece)
- **Renkli Gösterim**: Her nöbet türü için farklı renk kodlaması
- **Kolay Seçim**: Tarihe tıklayarak hızlı nöbet atama

### 📊 İstatistikler
- **Aylık Toplam**: Seçili ay için toplam çalışma saati hesaplaması
- **Gerçek Zamanlı**: Nöbet ekledikçe otomatik güncellenen istatistikler

### 🕒 Özel Nöbetler
- **Kendi Nöbetini Tanımla**: Sabit 5 nöbet türüne ek olarak başlangıç/bitiş saati seçerek özel nöbet tipleri oluşturma
- **Otomatik Süre Hesaplama**: Gece yarısını geçen aralıklar dahil, saat farkından otomatik çalışma süresi hesaplama

### 💾 Veri Yönetimi
- **Yerel Depolama**: AsyncStorage ile güvenli veri saklama
- **Dışa Aktarma**: Verileri gerçek bir `.json` yedek dosyası olarak native paylaşım menüsüyle Dosyalar/Drive/iCloud'a kaydetme
- **İçe Aktarma**: Dosya seçici ile önceden alınan bir yedek dosyasından geri yükleme (doğrulamalı, geçersiz dosyalar reddedilir)
- **Temizleme**: Tüm çizelgeyi sıfırlama seçeneği

### 🎨 Kullanıcı Deneyimi
- **Dark/Light Mode**: Sistem ayarlarına uyumlu tema desteği
- **Türkçe ve İngilizce Lokalizasyon**: Tam dil desteği
- **Responsive Tasarım**: Farklı ekran boyutlarına uyumlu
- **Modern UI**: React Native Paper (Material Design 3) ve Poppins font ailesi ile şık tasarım
