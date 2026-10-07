# dizdar teması

dizdar.dev için LoveIt'ten esinlenen, Tailwind CSS v4 ile yazılmış Hugo teması.

## Geliştirme

```sh
npm install        # Tailwind CLI
npm run dev        # hugo server
npm run build      # hugo --gc --minify
```

Hugo, render ettiği her class'ı `hugo_stats.json`'a yazar; Tailwind yalnızca bu class'lar için CSS üretir.
JS ile sonradan eklenen elemanların stilleri `assets/css/main.css` içinde bileşen class'ı olarak durur.

## Yazı tipleri (`postType`)

| Tip | Anasayfada | Oluşturma |
|---|---|---|
| `article` (varsayılan) | Özet + "Devamını oku" | `hugo new content posts/baslik.md` |
| `snippet` | İçeriğin tamamı | `hugo new content --kind snippet posts/baslik.md` |
| `video` | Video + içeriğin tamamı | `hugo new content --kind video posts/baslik.md` |

`video` alanı bir YouTube adresi/ID'si ya da yazının klasöründeki bir video dosyası olabilir.
YouTube videoları önce kapak görseliyle gösterilir, oynatıcı tıklanınca yüklenir.

Yeni bir tip eklemek için `layouts/_partials/summary/<tip>.html` oluşturmak yeterli.

## Projeler

```sh
hugo new content --kind project projects/uygulama-adi
```

```
content/projects/uygulama-adi/
├── _index.md              # proje sayfası (description, platforms, links)
├── _index.en.md           # İngilizcesi
├── icon.png               # uygulama ikonu
├── screenshots/           # galeri
├── gizlilik-politikasi.md
└── gizlilik-politikasi.en.md   # slug: privacy-policy
```

## Çok dillilik

Türkçe kökte (`/2023/yazi/`), İngilizce `/en/` altında. Bir sayfanın çevirisi aynı adla `.en.md` uzantılı dosyadır
(`yazi.md` → `yazi.en.md`). Çevirisi olan sayfalarda dil bağlantısı otomatik çıkar.

## İçerik sözdizimi

- Uyarı kutuları: `> [!TIP] Başlık`; `> [!QUOTE]- Başlık` kapalı başlar.
  Tipler: note, info, abstract, tip, success, question, important, warning, caution, failure, danger, bug, example, quote.
- İçindekiler: front matter'da `toc: true` / `false`.
- Uzun kod blokları `code.maxShownLines` satırdan sonra daraltılır.
