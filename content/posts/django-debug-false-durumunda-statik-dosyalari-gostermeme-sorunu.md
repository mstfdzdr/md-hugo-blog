---
title: "Django, DEBUG:False Durumunda Statik Dosyaları Göstermeme Sorunu"
subtitle: ""
date: 2023-01-30T16:16:22+03:00
aliases: ["/django-debug-false-durumunda-statik-dosyalari-gostermeme-sorunu/"]
lastmod: 2023-01-30T16:16:22+03:00
tags: []
categories: ["Django"]
featuredImage: ""
featuredImagePreview: ""
draft: false
toc:
    enable: true
    auto: true
code:
    copy: true
    maxShownLines: 50
---

Herkese selam, işim sebebiyle bu aralar sık sık Django kurcalıyorum. Tabii hobi amaçlı geliştirilen yazılımlar genelde lokalde ve tıkır tıkır çalışıyor.
Çünkü projeyi public yapma derdin yok, güvenlik sıkıntın yok vs. İşte geliştirdiğimiz uygulamaları bir serverda ayağa kaldırdığımız için projeyi debug moddan çıkarmak gibi bazı aksiyonlar gerekiyor.

### E normali bu!

Kesinlikle katılıyorum normali bu, böyle olmalı ama daha önce hep lokalde çalışınca debug:false durumlarını test etmemiş oluyor insan 🙂
Proje bitti, hadi servera atalım, dur atmadan da debug:false yapalım diyorsun ve taa daa! CSS’ler falan mortingen.
Sonra dökümantasyona bakayım dur diyorsun ve Django ağabeyimiz diyor ki, eğer debug modda çalışmıyorsan statik dosyalarını render etmekle falan ben daha uğraşmam.

### Peki nasıl çözeceğiz?

Esasında {{< link href="https://stackoverflow.com/questions/5836674/why-does-debug-false-setting-make-my-django-static-files-access-fail" content="stackoverflow’da" >}} epey konuşulmuş ve baya da yöntemler önerilmiş. Fakat Django sürümleri vb. nedeniyle önerilen çözümlerde import edilen url kütüphanesi değişmiş falan. Ben kendimde nasıl aştım bu durumu adım adım paylaşayım.

### settings.py

Öncelikle debug:false yapalım ve tüm hostlardan gelsinler sitemize diyelim.

{{< highlight python >}}
DEBUG = False
ALLOWED_HOSTS = ['*']
{{< /highlight >}}


Sonra statik dosyalarımızın için kullandığımız STATICFILES_DIRS ve STATIC_ROOT atamalarını şu şekilde yapalım.

{{< highlight python >}}
STATIC_URL = '/static/'
MEDIA_URL = '/media/'
if DEBUG:
STATICFILES_DIRS = [os.path.join(BASE_DIR, "dev-static")] #geliştirme aşaması için static dosyalarının bulunduğu dizin
else:
STATIC_ROOT = os.path.join(BASE_DIR, 'static') #deploy edilmiş için static dosyalarının bulunduğu dizin
{{< /highlight >}}

Bitti mi? Bitmedi şimdi esas patlayan yer olan urls’e gideceğiz.

### urls.py

Burada genelde django.urls’den path falan import etmiş oluyoruz. Onun yanına bir de url yerine kullanılan re_path ekleyecek ve django.views.static’ten serve import edeceğiz. Aşağıdaki gibi olacak yani.

{{< highlight python >}}
from django.urls import path, include, re_path
from django.views.static import serve
{{< /highlight >}}

Daha sonra urlpatterns içerisinde aşağıdaki iki satırı ekledik mi, işlem tamamdır.

{{< highlight python >}}
re_path(r'^media/(?P<path>.*)$', serve,{'document_root': settings.MEDIA_ROOT}),
re_path(r'^static/(?P<path>.*)$', serve,{'document_root': settings.STATIC_ROOT}),
{{< /highlight >}}

Dipnot: Eğer Django sürümünüz 3’ün altında ise aşağıdaki gibi yapmanız gerek.

{{< highlight python >}}
from django.conf.urls import url
from django.conf import settings
from django.views.static import serve

urlpatterns = [
url(r'^media/(?P<path>.*)$', serve,{'document_root': settings.MEDIA_ROOT}),
url(r'^static/(?P<path>.*)$', serve,{'document_root': settings.STATIC_ROOT}),
]
{{< /highlight >}}

Ben de bu adımlar çiçek gibi çalıştı. Umarım siz de faydasını görürsünüz.
