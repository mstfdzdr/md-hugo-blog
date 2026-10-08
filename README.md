# dizdar.dev

[dizdar.dev](https://dizdar.dev) blogunun kaynağı. Hugo + kendi temamız (`themes/dizdar`, Tailwind CSS).
`master`'a her push'ta GitHub Actions siteyi derleyip GitHub Pages'e yayınlar.

## İlk kurulum

```sh
brew install hugo   # extended sürüm, 0.158+
npm install         # Tailwind CLI
```

## Siteyi yerelde açmak

```sh
npm run dev          # http://localhost:1313
npm run dev:drafts   # draft'lar ve ileri tarihli yazılar da görünsün
```

Kaydettiğin her değişiklik tarayıcıda anında yenilenir.

---

## Yeni yazı (sadece Türkçe)

```sh
hugo new content posts/docker-ile-postgres-kurmak.md
```

Dosya adı yazının adresi olur: `dizdar.dev/2026/docker-ile-postgres-kurmak/`
(yıl, `date` alanından gelir). Türkçe karakter ve boşluk kullanma.

Açılan dosyada başlığı düzelt (dosya adından otomatik üretilir, Türkçe harfleri bozabilir: "Ile" → "ile"),
etiket ve kategori ekle, yazını `---` satırının altına yaz.

## Yeni yazı (Türkçe + İngilizce)

Aynı dosya adıyla, sonuna `.en` ekleyerek ikinci bir dosya oluştur. Hugo ikisini birbirinin çevirisi sayar.

```sh
hugo new content posts/docker-ile-postgres-kurmak.md
hugo new content posts/docker-ile-postgres-kurmak.en.md
```

`content/posts/docker-ile-postgres-kurmak.md`:

```yaml
---
title: "Docker ile PostgreSQL kurmak"
date: 2026-10-08T21:00:00+03:00
postType: article
tags: ["docker", "postgresql"]
categories: ["Nasıl Yapılır"]
draft: false
---

Yazının Türkçesi...
```

`content/posts/docker-ile-postgres-kurmak.en.md`:

```yaml
---
title: "Installing PostgreSQL with Docker"
slug: "installing-postgresql-with-docker"
date: 2026-10-08T21:00:00+03:00
postType: article
tags: ["docker", "postgresql"]
categories: ["How-to"]
draft: false
---

The English version...
```

Sonuç:

| | Adres |
|---|---|
| Türkçe | `dizdar.dev/2026/docker-ile-postgres-kurmak/` |
| İngilizce | `dizdar.dev/en/2026/installing-postgresql-with-docker/` |

- `slug` İngilizce adresi belirler. Yazmazsan Türkçe dosya adı kullanılır (`/en/2026/docker-ile-postgres-kurmak/`).
- Etiket ve kategoriler her dilde ayrıdır; İngilizce yazıya İngilizce etiket ver.
- İki sayfada da "Bu sayfa şu dilde de var" bağlantısı ve üst menüdeki TR/EN düğmesi otomatik olarak birbirini gösterir.
- Sadece İngilizce bir yazı istersen yalnızca `.en.md` dosyasını oluştur.

### Görselli yazı

Görselleri yazıyla birlikte tutmak için dosya yerine klasör kullan:

```
content/posts/docker-ile-postgres-kurmak/
├── index.md       # Türkçe
├── index.en.md    # İngilizce (slug yine burada)
└── kurulum.png
```

Yazıda `![Kurulum ekranı](kurulum.png)` yazman yeterli; iki dil de aynı görseli kullanır.
Adres klasör adından gelir. (Eski yazılardaki gibi görseli `static/images/` altına koyup
`/images/kurulum.png` diye kullanmak da çalışır.)

## Yazı tipleri

Front matter'daki `postType` anasayfadaki görünümü belirler:

| Tip | Anasayfada | Komut |
|---|---|---|
| `article` | Özet + "Devamını oku" | `hugo new content posts/ad.md` |
| `snippet` | İçeriğin tamamı (kısa kod parçaları için) | `hugo new content --kind snippet posts/ad.md` |
| `video` | Video + içeriğin tamamı | `hugo new content --kind video posts/ad.md` |

Video yazısında `video:` alanına YouTube adresini (`https://youtu.be/...`) ya da yazının klasöründeki bir video dosyasını yaz.

Article özetinin nerede biteceğini kendin belirlemek istersen metnin içine `<!--more-->` koy.

## Yayınlamak

1. Yazının `draft:` alanını `false` yap (`true` iken sitede görünmez).
2. Tarih gelecekteyse yazı o tarih gelene kadar görünmez.
3. Commit + push:

```sh
git add content
git commit -m "Yeni yazı: Docker ile PostgreSQL"
git push origin master
```

1-2 dakika içinde dizdar.dev'de. İlerlemeyi GitHub'da **Actions** sekmesinden izleyebilirsin.

---

## Yeni proje

```sh
hugo new content --kind project projects/uygulama-adi
```

```
content/projects/uygulama-adi/
├── _index.md                   # proje sayfası: description, platforms, links (mağaza linkleri)
├── _index.en.md                # İngilizcesi
├── icon.png                    # uygulama ikonu
├── screenshots/                # galerideki görseller (Türkçe sayfa)
│   └── en/                     # İngilizce sayfa için ayrı görseller (yoksa üsttekiler kullanılır)
├── gizlilik-politikasi.md      # yasal metinler proje sayfasında listelenir
└── gizlilik-politikasi.en.md   # front matter'a slug: "privacy-policy"
```

`description` proje sayfasında tam, /projects/ listesindeki kartta en fazla 2 satır gösterilir.

Ekran görüntüleri dosya adı sırasıyla gösterilir (`01-…`, `02-…`). Her sayfa önce kendi dilinin klasörüne bakar:
İngilizce sayfa `screenshots/en/` içindekileri gösterir; bu klasör yoksa ya da boşsa `screenshots/` altındakileri
kullanır. Türkçe sayfa her zaman `screenshots/` altındakileri gösterir.

Büyütünce altında yazı çıksın istersen ilgili dilin `_index` dosyasının front matter'ına ekle:

```yaml
# _index.md
resources:
  - src: screenshots/01-schedule.png
    title: "Aylık nöbet takvimi"
```

```yaml
# _index.en.md
resources:
  - src: screenshots/en/01-schedule.png
    title: "Monthly duty calendar"
```

Gizlilik metinlerini arama ve sitemap dışında tutmak için front matter'a şunu ekle:

```yaml
hiddenFromSearch: true
sitemap:
  disable: true
```

## Yazarken işe yarayanlar

- **Başlıklar:** bölümler için `##`, alt bölümler için `###` kullan. `#` (H1) yazının başlığıdır (`title`);
  metin içinde kullanılırsa o bölüm içindekiler tablosunda çıkmaz ve diğer başlıklardan farklı görünür.

  ```markdown
  ## Sorun ne?
  ### İlk deneme
  ## Çözüm
  ```

- **Uyarı kutusu:**

  ```markdown
  > [!TIP] Ek not
  > Kutunun içeriği.
  ```

  Tipler: `NOTE`, `INFO`, `TIP`, `WARNING`, `DANGER`, `QUOTE`, `BUG`, `EXAMPLE`, `QUESTION`, `SUCCESS`…
  Başlığın önüne `-` koyarsan kutu kapalı başlar: `> [!QUOTE]- Kaynaklar`
- **İçindekiler:** front matter'da `toc: true`
- **Uzun kod blokları:** varsayılan olarak 10 satırdan sonra daraltılır; yazı bazında değiştirmek için:

  ```yaml
  code:
    maxShownLines: 50
  ```

- **Anasayfada gizlemek:** `hiddenFromHomePage: true`
- **Aramada gizlemek:** `hiddenFromSearch: true`

Temanın teknik detayları: [themes/dizdar/README.md](themes/dizdar/README.md)
