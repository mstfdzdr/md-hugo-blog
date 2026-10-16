---
title: "EnvKit"
description: "Windows ortam değişkenlerini, PATH'i ve Credential Manager'ı tahmin yürütmeden yönetmek için masaüstü uygulaması ve komut satırı aracı."
weight: 2
# Publish only the resized screenshots, not the originals
build:
  publishResources: false
platforms: ["Windows", "CLI", "Açık kaynak"]
links:
  github: "https://github.com/mstfdzdr/envkit"
# Screenshot captions (screenshots/tr/ is shown on this page, screenshots/en/ on the English one)
resources:
  - src: "screenshots/tr/01-path.png"
    title: "PATH sağlık kontrolü: olmayan klasörler, tekrarlar, tırnaklı ve çözülemeyen girdiler; altta hangi python.exe'nin çalıştığı"
  - src: "screenshots/tr/02-review.png"
    title: "Her değişiklik uygulanmadan önce fark (diff) olarak gösterilir"
  - src: "screenshots/tr/03-variables.png"
    title: "Kullanıcı ve sistem değişkenleri; token gibi görünen değerler gizlenir"
  - src: "screenshots/tr/04-credentials.png"
    title: "Credential Manager kayıtları, sahibi olan araca göre gruplanmış; toplu silme"
  - src: "screenshots/tr/05-profiles.png"
    title: "Profiller: java21 gibi adlandırılmış değişiklik setleri"
  - src: "screenshots/tr/06-vault.png"
    title: "DPAPI ile şifreli kasa; profiller ${vault:AD} ile başvurur"
  - src: "screenshots/tr/07-project-secrets.png"
    title: "Proje gizlileri: .env dosyaları ve git'e commit edilmiş olanlar için uyarı"
  - src: "screenshots/tr/08-history.png"
    title: "Geçmiş: her değişiklikten önce alınan snapshot'a geri dönülebilir"
---

**EnvKit**, Windows'ta ortam değişkenlerini, PATH'i ve kayıtlı kimlik bilgilerini (Credential Manager) güvenle yönetmek için geliştirdiğim açık kaynaklı bir araç. Neyin bozuk olduğunu gösterir, her değişikliği uygulamadan önce fark olarak önizletir ve her şeyi geri almanıza izin verir. Masaüstü uygulaması ile `envkit` komut satırı aracı aynı motoru paylaşır.

> Ekran görüntülerindeki bütün değerler (kullanıcı adları, klasörler, kimlik bilgileri) örnek verilerdir.

## Neden?

Windows'un yerleşik editörü PATH'i küçük bir liste olarak gösterir, o kadar. Bir girdinin var olmayan bir klasörü gösterdiğini, üç kez tekrarlandığını ya da hiç etkili olmadığını söylemez; geçmiş tutmaz ve `%DEĞİŞKEN%` başvurularını sessizce bozabilir. Credential Manager'da ise arama zayıftır, toplu silme yoktur ve hangi kaydın hangi araca ait olduğu belli değildir. EnvKit bu boşlukları doldurmak için yazıldı.

## ✨ Özellikler

### 🩺 PATH sağlık kontrolü
- **Sorun tespiti**: Olmayan klasörler, (genişletildikten sonra, büyük/küçük harf duyarsız) tekrarlar, boş ve tırnaklı girdiler, göreli yollar, çözülemeyen `%DEĞİŞKENLER%`
- **REG_SZ tuzağı**: PATH `REG_SZ` olarak saklandığı için hiç genişlemeyen başvuruları yakalar
- **Gölgeleme**: `envkit which python` arama sırasındaki tüm eşleşmeleri listeler; hangisinin çalıştığını, hangilerinin (Microsoft Store kısayolu dahil) gölgede kaldığını görürsünüz
- **Tek tıkla düzeltme**: Boş ve tekrarlanan girdileri temizleme, olmayan klasörleri kaldırma, sürükle-bırak ile sıralama

### 🔍 Önce önizle, sonra uygula
- **Diff önizleme**: Her değişiklik önce fark olarak gösterilir; PATH değişiklikleri girdi girdi karşılaştırılır
- **Geri alma**: Her değişiklikten önce tüm değişkenlerin snapshot'ı alınır; Geçmiş sayfasından veya `envkit snapshot restore` ile geri yüklenebilir
- **Güvenli yazma**: Değerler kayıt defteri türünü korur (`REG_EXPAND_SZ` genişleyebilir kalır), önizlemeden sonra başka biri değiştirdiyse değişiklik reddedilir, yarıda kalan bir yazma geri sarılır
- **En az yetki**: Uygulama normal kullanıcı olarak çalışır, yalnızca sistem kapsamındaki değişiklikler için tek bir UAC onayı ister

### 🔑 Kullanılabilir bir Credential Manager
- **Araca göre gruplama**: git, GitHub Desktop, Visual Studio, VS Code, Docker, Uzak Masaüstü, Microsoft hesabı, Office…
- **Arama, düzenleme, toplu silme**: Silme ve düzenlemeler de snapshot'lanır, toplu bir temizlik geri alınabilir
- **Envanter dışa aktarma**: Hiçbir gizli bilgi içermeyen JSON envanter
- Etki alanı (domain) kimlik bilgileri istisnadır: Windows bunların parolasını hiçbir zaman göstermez, bu yüzden silmek kalıcıdır ve EnvKit bunu önceden söyler

### 🧩 Profiller ve kasa
- **Profiller**: "java21" gibi adlandırılmış değişiklik setleri (`JAVA_HOME`'u ayarla, `%JAVA_HOME%\bin`'i PATH'in başına koy). Ortamınıza uygulanabilir (her değişiklik gibi incelenir ve geri alınabilir) ya da `envkit run` ile tek bir komut için kullanılabilir
- **Gizli bilgi kasası**: API anahtarları ve token'lar ortam değişkenlerinde değil, DPAPI ile şifrelenmiş bir kasada durur. Profiller bunlara `${vault:AD}` ile başvurur, `envkit run` bunları yalnızca ihtiyaç duyan sürece verir; kalıcı ortama asla yazılmaz
- **Gizlilik**: Token ya da parola gibi görünen değişkenler siz istemedikçe maskelenir, snapshot'lar DPAPI ile şifrelenir

### 📁 .env dosyaları ve .NET user-secrets
- **Tarama**: Bir klasör ağacındaki `.env` dosyalarını ve user-secrets kullanan projeleri bulur; git'e commit edilmiş ya da `.gitignore`'da olmayan `.env` dosyaları için uyarır
- **Dosyayı bozmadan düzenleme**: Yorumlar, tırnaklar, `export`, satır sonları ve BOM olduğu gibi kalır
- **Kasaya taşıma**: Bir gizli bilgiyi `.env`'den kasaya taşır, dosyada `${vault:AD}` bırakır; `envkit run --env-file .env` çalışırken değeri geri doldurur

### 🌐 Dil ve tema
- Masaüstü uygulaması **Türkçe ve İngilizce**; varsayılan olarak Windows dilini izler, Ayarlar'dan yeniden başlatmadan değiştirilebilir
- Windows'un açık/koyu temasını izler ya da birini seçebilirsiniz
- `envkit` komut satırı, betiklerde çıktısı sabit kalsın diye İngilizce'dir

## 📦 Kurulum

En son sürümün `EnvKit-win-Setup.exe` dosyasını [GitHub Releases](https://github.com/mstfdzdr/envkit/releases/latest) sayfasından indirin. Kurulum kullanıcı bazındadır (yönetici yetkisi gerekmez), `envkit`'i kullanıcı PATH'inize ekler ve kendini GitHub Releases üzerinden günceller. winget paketi yolda.

## ⌨️ Komut satırı

Örneğin bir token'ı ortamınıza koymadan tek bir araca vermek:

```powershell
envkit vault set github                     # değeri sorar
envkit run -s GITHUB_TOKEN=github -- gh repo list
```

Ortamınıza dokunmadan komut bazında JDK değiştirmek:

```powershell
envkit profile new java21 --set "JAVA_HOME=C:\jdk-21" --prepend-path "%JAVA_HOME%\bin"
envkit run -p java21 -- mvn package
```

Bir projenin `.env` dosyasındaki canlı anahtarı uygulamayı bozmadan dışarı almak:

```powershell
envkit dotenv link STRIPE_SECRET stripe --move     # değer kasaya gider, dosyada ${vault:stripe} kalır
envkit run -e .env -- npm start                    # süreç yine gerçek değeri görür
```

Yazan komutlar farkı gösterip onay ister. `--dry-run` yalnızca önizler, `--yes` soruyu atlar (betiklerde gereklidir). Komutların tam listesi [README](https://github.com/mstfdzdr/envkit#cli)'de.

## 🛠️ Teknik

- .NET 10, WPF (WPF-UI ile Fluent tasarım), MVVM
- Platformdan bağımsız bir çekirdek (`EnvKit.Core`), Windows'a özgü katman (kayıt defteri, `CredEnumerate`/`CredWrite`, DPAPI, `WM_SETTINGCHANGE`, UAC), ince bir CLI ve masaüstü uygulaması
- Velopack ile kurulum ve otomatik güncelleme; GitHub Actions ile CI ve sürüm yayını
- Testler gerçek ortamınıza asla yazmaz: kayıt defteri testleri `HKCU\Software\EnvKit.Tests-*` altındaki geçici anahtarları kullanır

## 📄 Lisans

EnvKit, [MIT lisansı](lisans) ile dağıtılan açık kaynaklı bir yazılımdır: ücretsiz kullanabilir, değiştirebilir ve dağıtabilirsiniz. Hata bildirimleri ve öneriler için [GitHub Issues](https://github.com/mstfdzdr/envkit/issues).
