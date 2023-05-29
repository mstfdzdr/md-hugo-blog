---
title: "Nginx - 413 Request Entity Too Large Hatası"
subtitle: ""
date: 2023-05-29T10:52:10+03:00
lastmod: 2023-05-29T10:52:10+03:00
tags: ["nginx", "ubuntu"]
categories: ["Linux"]
featuredImage: ""
featuredImagePreview: ""
draft: false
toc:
    enable: false
    auto: false
code:
    copy: true
    maxShownLines: 50
---

Ubuntu server üzerinde çalışan bir uygulamamda klasik CRUD işlemleri yapılırken, form data ile giden veriler sonunda başlıktaki hatayı aldım. Kullanıcı sisteme 1.2MB büyüklüğünde bir PDF
yüklemeye çalışmış.

<!--more-->

413 hatasını ilk kez gören ben ufak bir stackoverflow araması sonunda öğrendim ki nginx'in ***client_max_body_size*** ayarını güncellemem gerekiyormuş. Çok emin olmamakla beraber
varsayılan değer 1MB belirliyormuş nginx. Bu değeri güncellemek için virtual host dosyalarımızda http kısmında aşağıdaki düzenlemeyi yapmak yeterli. Ben 5MB olacak şekilde ayarladım.

{{< highlight bash >}}
http {
    ...
    client_max_body_size 5M;
}
{{< /highlight >}}

Kaynak: https://stackoverflow.com/questions/28476643/default-nginx-client-max-body-size