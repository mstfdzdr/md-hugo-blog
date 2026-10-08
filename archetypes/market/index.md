---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
description: ""
date: {{ .Date }}
draft: true
# Boş bırakırsan "Fiyat için sorun" yazar
price:
# available (satışta) | reserved (rezerve) | sold (satıldı)
status: available
# new (sıfır) | like-new (sıfır ayarında) | good (iyi) | fair (kullanılmış)
condition: good
specs:
  - name: "Model"
    value: ""
# Satış ilanları; yoksa sil
links:
  - name: "Sahibinden"
    url: ""
# Fotoğraflar: images/ klasörüne koy (01.jpg, 02.jpg…); ilki kapak olur.
---

