---
title: "Apple Silicon işlemcili bilgisayarda PHP ve XDebug kurulumu macerası"
subtitle: ""
date: 2023-02-07T15:46:21+03:00
lastmod: 2023-02-07T15:46:21+03:00
tags: ["xdebug", "php debugger"]
categories: ["PHP"]
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

Geçenlerde Laravel projelerine merak sardım. Hızlıca auth sistemleri oluşturmak, direkt rest api destekli kod yazmak epey keyifli. Neyse bu başka yazıların konusu.
Laravel yazarken debug yapmak için ***dd*** ya da ***ddd*** yapmak epey işlevsel sonuçlar döndürüyor ama yine de insan IDE içerisinden debug pointler ile akışı takip etme ihtiyacı
duyuyor. Bunun için de XDebug kurmak gerekliymiş.
<!--more-->

### Sistemdeki PHP'ye göz atalım

Eğer bilgisayarınıza daha önceden PHP kurduysanız, terminalde **php --version** yazarak hangi sürüm PHP'ye sahip olduğunuzu görüntüleyebilirsiniz. Size aşağıdaki gibi bir sonuç dönecektir.

{{< highlight bash >}}
PHP 8.1.11 (cli) (built: Sep 29 2022 19:44:28) (NTS)
Copyright (c) The PHP Group
Zend Engine v4.1.11, Copyright (c) Zend Technologies
with Zend OPcache v8.1.11, Copyright (c), by Zend Technologies
{{< /highlight >}}

{{< admonition type=info title="Brew ile PHP kurma" open=true >}}
Eğer sisteminizde brew varsa, PHP kurmak için tek satır yeterli.

{{< highlight bash >}}
brew install php
{{< /highlight >}}
{{< /admonition >}}

PHP işi tamamsa, gelelim Xdebug'a.

### XDebug kurulumu

Terminali açıp aşağıdaki kodu çalıştıralım.

{{< highlight bash >}}
arch -arm64 pecl install xdebug
{{< /highlight >}}

Bu kod arm64 mimariye sahip bilgisayarlar için yalnız. Daha eski bir cihazınız varsa şunu deneyebilirsiniz.

{{< highlight bash >}}
pecl install xdebug
{{< /highlight >}}

### Ben hata aldım :(

Tam bu noktada her şey başarılıysa aşağıdaki gibi bir mesaj göreceksiniz terminalde.

{{< highlight bash >}}
Build process completed successfully
Installing '/opt/homebrew/Cellar/php/8.1.11/pecl/20210902/xdebug.so'
install ok: channel://pecl.php.net/xdebug-3.1.5
Extension xdebug enabled in php.ini
{{< /highlight >}}

Ben bu mesajı alamadım. Bana aşağıdaki gibi bir mesaj geldi...

{{< highlight bash >}}
Warning: mkdir(): File exists in System.php on line 294
PHP Warning:  mkdir(): File exists in /usr/local/Cellar/php/7.3.3/share/php/pear/System.php on line 294

Warning: mkdir(): File exists in /usr/local/Cellar/php/7.3.3/share/php/pear/System.php on line 294
ERROR: failed to mkdir /usr/local/Cellar/php/7.3.3/pecl/20180731
{{< /highlight >}}

Haydaaa. Halbuki izlediğim tüm tutoriallerde tıkır tıkır yapıyordu herkes. Neyse ara tara derken aşağıdaki işlemleri yaparak bu sorunu çözüm. Kırık bazı dosya yolu hataları sebebiyle
bu hatayı alıyormuşuz.
{{< highlight bash >}}
pecl config-get ext_dir | pbcopy
mkdir -p [BURADA CMD + V YAPMALISINIZ]
{{< /highlight >}}

Bu aşamadan sonra yukarıdaki XDebug kurulum kodunu tekrar çalıştırın. Ta daaa :) Sonrası IDE ayarları yapmak. Kolay gele.