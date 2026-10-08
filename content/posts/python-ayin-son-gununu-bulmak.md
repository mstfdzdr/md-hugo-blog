---
title: "Python: Ayın Son Gününü Bulmak"
subtitle: ""
date: 2023-01-27T13:49:23+03:00
aliases: ["/python-ayin-son-gununu-bulmak/"]
lastmod: 2023-01-27T13:49:23+03:00
postType: snippet
tags: []
categories: ["Python"]
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
Bir iş için girilen bir ayın son gününü bulmam gerekti. Kendime not olsun diye buraya da ekleyeyim istedim.
<!--more-->

Pythonda bunu calendar.monthrange ile kolayca döndürebiliyoruz. [Dökümantasyona](https://docs.python.org/3/library/calendar.html#calendar.monthrange) göre bu method belirtilen yıl ve ay için ayın ilk
gününün hafta içi gününü ve aydaki gün sayısını döndürüyor. O yüzden şu şekilde istediğimiz ayın son gününe ulaşmak mümkün.

```Python
import calendar
ayinSonGunu = calendar.monthrange(2022,4)[1]
print(ayinSonGunu)
```

