---
title: "Created at Alanini Humanize Etmek"
subtitle: ""
date: 2025-11-01T16:05:22+03:00
lastmod: 2025-11-01T16:05:22+03:00
postType: article
tags: [django]
categories: [django]
featuredImage: ""
featuredImagePreview: ""
draft: true
toc:
    enable: true
    auto: false
code:
    copy: true
    maxShownLines: 50
---

Eğer `{{ post.created_at }}` alanını Django template içinde "insan okunabilir fark formatında" (örneğin: “3 dakika önce”, “2 gün önce”) göstermek istiyorsan, Django’nun `timesince` filtresini kullanabilirsin.

### Basit kullanım:

```django
{{ post.created_at|timesince }} önce
```

Bu, örneğin şöyle bir çıktı verir:

```
3 saat önce
```

---

### 🔧 Eğer tam saat dilimini istiyorsan (örn. “3 saat, 25 dakika önce”):

```django
{{ post.created_at|timesince }} önce
```

Bu zaten saat + dakika gibi detaylı gösterecektir.

---

### ⏳ Alternatif: `naturaltime` filtresi (daha doğal anlatım)

`naturaltime` daha “doğal” bir görünüm sağlar (örn: “an instant ago”, “yesterday”). Bunun için önce `humanize` kullanman gerekir:

#### 1. Template’in en başında şunu ekle:

```django
{% load humanize %}
```

#### 2. Kullanım:

```django
{{ post.created_at|naturaltime }}
```

---

### 🔁 Örnek Tam Template Parçası:

```django
{% load humanize %}

<p>Yayınlanma: {{ post.created_at|naturaltime }}</p>
```

---

### ⚠️ Not:

- `naturaltime` kullanabilmek için `USE_L10N = True` ve `django.contrib.humanize` app’in `INSTALLED_APPS` içinde olması gerekir.
    

### Sadece Gun/Ay/Yil seklinde Gostermek:

```django
{{ post.created_at|date:"d M Y" }}
```

### Açıklama:

- `d` → Gün (01-31)
    
- `M` → Ayın kısa adı (Jan, Feb, Mar vs.)
    
- `Y` → 4 basamaklı yıl (2025 gibi)
    

Alternatif formatlar:

- `{{ post.created_at|date:"d.m.Y" }}` → `14.06.2025`
    
- `{{ post.created_at|date:"d F Y" }}` → `14 June 2025`
    
- `{{ post.created_at|date:"j F Y" }}` → `14 June 2025` (önünde sıfır olmayan gün)
    

### Türkçe ay isimleri istiyorsan:

1. `settings.py` dosyanda `LANGUAGE_CODE = 'tr'` olmalı.
    
2. Ayrıca locale'nin sistemde kurulu olması gerekir (`tr_TR.UTF-8` gibi).
    
