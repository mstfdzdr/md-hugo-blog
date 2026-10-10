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

## VS Code ile içerik yönetimi (Front Matter CMS)

Terminal komutları yerine VS Code içindeki **Front Matter CMS** panelini kullanabilirsin. Ayarları repodaki
`frontmatter.json` dosyasında; eklentiyi kurman yeterli (VS Code bu projeyi açınca önerir).

**Paneli açmak:** Sol çubuktaki Front Matter ikonu → **Open dashboard**. Bütün içerik (Yazılar, Projeler,
Bit Pazarı, Sayfalar) burada listelenir; arayabilir, taslakları filtreleyebilirsin.

**Yeni içerik:** Dashboard → **Create content** → klasörü seç (Yazılar / Projeler / Bit Pazarı) → başlığı yaz.
Dosya doğru yerde, doğru alanlarla ve **taslak** olarak oluşur. Bit Pazarı ürünü ve proje klasör olarak
oluşturulur (`images/`, `screenshots/` klasörlerini içine sen eklersin).

**Alanları düzenlemek:** Bir içerik dosyası açıkken Front Matter yan paneli alanları form olarak gösterir:
yazı tipi, durum ve kondisyon açılır listeden, fiyat sayı kutusundan, taslak ve "anasayfada tamamını göster"
düğmeden, etiket ve kategoriler var olanlardan seçilir, tarihler takvimden. "Video" alanı sadece yazı tipi
Video iken, "Anasayfada tamamını göster" sadece Makale iken görünür.

**İngilizce çeviri:** Türkçe dosya açıkken yan panelde **İngilizce çevirisini oluştur** düğmesine bas
(Custom actions bölümünde). Aynı adla `.en.md` dosyası oluşturulur ve açılır:

- taslak olarak başlar (`draft: true`),
- Türkçe eski adres yönlendirmeleri (`aliases`) kopyalanmaz,
- yazılarda başlığın altına `slug` hatırlatması eklenir; İngilizce adresi oraya yaz,
- metin Türkçe gelir, başındaki `<!-- TODO: translate to English -->` notunu çevirince sil.

Çeviri zaten varsa yenisini oluşturmaz, var olanı açar.

**Önizleme:** Panelde **Start server** (`npm run dev`), sonra **Open preview**.

Bilmen gerekenler:

- Front Matter, Bit Pazarı ürünlerine `type: market`, projelere `type: projects`, sayfalara `type: page` yazar.
  Bunlar Hugo'da zaten varsayılan değerler, sitede hiçbir şeyi değiştirmez; silmene gerek yok.
  Yazılara `type` yazılmaz.
- Başlıkta "İ" varsa Front Matter dosya adını bozuk üretiyor (`i̇lk-deneme.md`); oluşturduktan hemen sonra
  bir script adı otomatik düzeltir (`ilk-deneme.md`).
- Etiket ve kategori önerileri `frontmatter.json` içindeki listelerden gelir; yeni etiket yazınca panel
  listeye eklemeyi teklif eder.

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

Her tipin kendi listesi var ve footer'dan açılır: `/types/article/`, `/types/snippet/`, `/types/video/`
(İngilizcesi `/en/types/…`). `postType` yazmazsan yazı `article` sayılır.

Bir article'ın özet yerine **tamamının** anasayfada görünmesini istersen (rozet olmadan, "Devamını oku" çıkmadan):

```yaml
postType: article
fullContent: true   # varsayılan: false
```

## Son güncelleme tarihi

Her yazının sonunda "Son güncelleme: **tarih**" kutusu çıkar. Tarih front matter'daki `lastmod` alanından gelir;
yoksa yayın tarihi (`date`) kullanılır. Bir yazıyı güncellediğinde `lastmod`'u o günün tarihi yap:

```yaml
date: 2025-11-24T23:47:35+03:00      # ilk yayın, değiştirme
lastmod: 2026-10-09T10:00:00+03:00   # son güncelleme
```

`lastmod` yayın tarihinden sonraysa kutuda "İlk yayın" tarihi de gösterilir ve başlığın altına
"Güncellendi: …" eklenir. Küçük düzeltmelerde (yazım hatası gibi) `lastmod`'a dokunmana gerek yok.

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

## SEO ve paylaşım görseli

**Açıklama:** Front matter'daki `description`, Google sonuçlarında ve link önizlemelerinde (X, LinkedIn, WhatsApp…)
görünen metindir. 150–160 karakter civarı bir cümle yaz. Boş bırakırsan yazının ilk paragrafı kullanılır.

```yaml
description: "macOS 27'de Shottr'ın neden kapandığını Terminal loglarıyla nasıl bulduğumu anlatıyorum."
```

**Paylaşım görseli:** Hiçbir şey yapmana gerek yok. Derleme sırasında her sayfa için yazının başlığı, kategorisi ve
avatarınla 1200×630 bir kart otomatik üretilir (projelerde avatar yerine uygulama ikonu). Bir yazıya özel görsel
istersen yazıyı klasör olarak oluştur ve görseli `cover.png` (ya da `.jpg`) adıyla koy, veya front matter'da belirt:

```yaml
images: ["kapak.png"]
```

**Arka planda otomatik olanlar:** canonical adres, TR/EN `hreflang` bağlantıları, sitemap (`/sitemap.xml`),
Open Graph / Twitter etiketleri ve Google için yapısal veri (yazılarda `BlogPosting`, projelerde `MobileApplication`).

**Kontrol araçları:**
- Google Search Console → sitemap: `https://dizdar.dev/sitemap.xml`; yeni yazıyı hızlandırmak için URL denetimi → "Dizine eklenmesini iste"
- Yapısal veri: [Rich Results Test](https://search.google.com/test/rich-results)
- Link önizlemesi: [opengraph.xyz](https://www.opengraph.xyz) ya da LinkedIn [Post Inspector](https://www.linkedin.com/post-inspector/)

---

## Menüler

İki menü var, ikisi de `hugo.toml`'da ve her dil için ayrı tanımlanır:

- `main`: üstteki menü. İçerik türleri burada (Yazılar, Projeler…); kalabalıklaşmasın.
- `footer`: footer'ın en üstündeki linkler (Etiketler, Kategoriler, Hakkımda).

Bir linki diğer menüye taşımak için girdinin menü adını değiştirmen yeterli:

```toml
[[languages.tr.menus.main]]      # üst menü
  identifier = "projects"
  name = "Projeler"
  pageRef = "/projects"
  weight = 2                     # sıra
  [languages.tr.menus.main.params]
    icon = "smartphone"          # isteğe bağlı, themes/dizdar/assets/icons/ içindeki ad

[[languages.tr.menus.footer]]    # footer
  identifier = "about"
  name = "Hakkımda"
  pageRef = "/pages/about"       # içeriğin dosya yolu (content/ altına göre), adres değil
  weight = 3
```

Aynı girdiyi İngilizce için `[[languages.en.menus.…]]` altına da ekle.

## Footer

Footer'daki linkler yukarıdaki `footer` menüsünden gelir. Diğer satırlar `hugo.toml` içindeki
`[params.footer]` bölümünden yönetilir; her satır kapatılabilir:

```toml
[params.footer]
  social = false         # sosyal medya ikonları (params.social listesinden)
  rss = true             # RSS linki (sosyal ikonlar kapalıyken yazı tipleri satırının sonunda)
  postTypes = true       # yazı tipleri (Makale, Snippet, Video) ve yazı sayıları
  tags = 0               # en çok kullanılan kaç etiket gösterilsin (0 = satırı gizle)
  tagsMinCount = 2       # ...en az kaç yazıda geçen etiketler
  copyright = "Mustafa Dizdar"   # boş bırakırsan © satırı gizlenir
  since = 2020
  license = '<a href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</a>'   # boş = gizle
  hugo = true            # "Hugo ile yapıldı"
  theme = true           # "Tema - dizdar"
```

Bir dil için farklı değer vermek istersen sadece değişen ayarı yaz, gerisi genel ayardan gelir:

```toml
[languages.en.params.footer]
  license = '<a href="…">CC BY 4.0</a>'
```

Sosyal medya hesapları `[[params.social]]` listesinde; buraya eklediğin hesap hem anasayfada hem footer'da görünür.
İkon adı `themes/dizdar/assets/icons/` içindeki dosya adıdır (örn. `brand-github`).

---

## Bit Pazarı (ikinci el ürünler)

```sh
hugo new content --kind market market/samsung-galaxy-watch-4-classic
```

Türkçe ve İngilizce dosyalarıyla birlikte bir klasör oluşur:

```
content/market/samsung-galaxy-watch-4-classic/
├── index.md       # Türkçe
├── index.en.md    # İngilizce
└── images/        # fotoğraflar: 01.jpg, 02.jpg… (ilki kapak ve paylaşım görseli olur)
```

```yaml
price: 4500                  # boş = "Fiyat için sorun"
status: available            # available (Satışta) | reserved (Rezerve) | sold (Satıldı)
condition: good              # new | like-new | good | fair
specs:                       # ürün sayfasındaki tablo
  - name: "Kasa"
    value: "46 mm"
links:                       # ilan butonları ("Sahibinden ilanına git"); url boşsa buton çıkmaz
  - name: "Sahibinden"
    url: "https://…"
```

- Liste sayfasında önce satıştakiler, sonra rezerve, en son satılanlar gösterilir. Satılan ürünün fiyatı üstü
  çizili ve fotoğrafı soluk görünür; ilan butonları gizlenir. Ürünü silmek yerine `status: sold` yapabilirsin.
- Para birimi varsayılan olarak TRY; ürün bazında `currency: USD` gibi değiştirebilirsin.
- "Bana ulaş" butonu `hugo.toml` içindeki `[params.market] contact` ile açılır (örn. `mailto:…` ya da bir DM linki).
- Ürün sayfaları Google'a `Product` olarak (fiyat, stok durumu, kondisyon) bildirilir.

---

## Yeni sayfa (Hakkımda, İletişim gibi)

Yazı, proje ya da ürün olmayan tekil sayfalar `content/pages/` altında durur:

```sh
hugo new content pages/iletisim.md       # Türkçe
hugo new content pages/iletisim.en.md    # İngilizce (front matter'a slug: "contact" yaz)
```

- Klasör sadece düzen için var; adresler kökte olur: `dizdar.dev/iletisim/`, `dizdar.dev/en/contact/`.
  `/pages/` diye bir sayfa yayınlanmaz.
- Sayfalar anasayfada listelenmez, site içi aramada çıkar (istemezsen `hiddenFromSearch: true`).
- Menüye eklemek için `hugo.toml`'da `pageRef = "/pages/iletisim"` (bkz. Menüler).
- Front Matter dashboard'unda "Sayfalar" klasöründen de oluşturabilirsin.

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
