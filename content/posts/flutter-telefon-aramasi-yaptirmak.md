---
title: "Flutter Telefon Araması Yaptırmak"
subtitle: ""
date: 2023-01-27T14:15:22+03:00
aliases: ["/flutter-telefon-aramasi-yaptirmak/"]
lastmod: 2023-01-27T14:15:22+03:00
tags: ["mobil programlama"]
categories: ["Flutter"]
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

Geçenlerde bir proje için modelden gelen numarayı arama ihtiyacı doğdu. Sonrasında araştırınca url launcher paketi ile bunun gerçekleştirildiğini gördüm.
Hatta paket sadece arama yapmak için değil, adı gibi tüm url açma işlemleri için kullanılıyor. Örn: web linkleri açmak, sms atmak, e-mail göndermek gibi.
<!--more-->

### Paketin Kurulumu

* [https://pub.dev/packages/url_launcher](https://pub.dev/packages/url_launcher) adresine gidip paketi yükleyin.
* Sonrasında paketi projenize import edin, ben bu örnekte urLauncher alias’ı ile import ettim.
* Arama yaptıracağınız butonun ya da herhangi bir şeyin, ben butondan örnek vereyim; onPressed metoduna;

{{< highlight dart >}}
onPressed: () => {
    urLauncher.launch('tel://' + $buradaTelefonNoValOlacak),
},
{{< /highlight >}}

Hepsi bu kadar 🙂 Ben telefon izni vs. gerekir diye düşündüm ama şimdilik karşıma öyle bir durum çıkmadı.

#### Kaynaklar:
* https://medium.flutterdevs.com/implementing-phone-calls-using-the-flutter-app-e350ea275c92
* https://pub.dev/packages/url_launcher
* https://stackoverflow.com/questions/45523370/how-to-make-a-phone-call-from-a-flutter-app
