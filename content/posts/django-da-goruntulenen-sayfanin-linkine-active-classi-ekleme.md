---
title: "Django’da görüntülenen sayfanın linkine active class’ı ekleme"
subtitle: ""
date: 2023-01-30T16:12:08+03:00
lastmod: 2023-01-30T16:12:08+03:00
tags: []
categories: ["Django"]
featuredImage: ""
featuredImagePreview: ""
draft: true
toc:
    enable: true
    auto: true
code:
    copy: true
    maxShownLines: 50
---

Kullanıcıların hangi sayfada olduğunu görsel olarak da bilmeye hakkı var değil mi? 🙂 Nasıl yapılır diye araştırırken Django’nun bunu url name’leri ile hallettiğini öğrendim.
<!--more-->

### Örnek urls.py dosyası

Tanımladığımız path’lere name atamayı unutmuyoruz.

{{< highlight python >}}
urlpatterns = [
path('', views.index, name="specialDaysHome"),
path('index', views.index),
]
{{< /highlight >}}

### Navigasyon linklerinin bulunduğu örnek html dosyası


{{< highlight html >}}
{% with request.resolver_match.url_name as url_name %}
<ul class="navbar-nav">
    <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
    </li>
    <li class="nav-item d-none d-sm-inline-block {% if url_name == 'home' %}active{% endif %}">
        <a href="{% url 'home' %}" class="nav-link">Genel Görünüm</a>
    </li>
    <li class="nav-item d-none d-sm-inline-block {% if url_name == 'todoHome' %}active{% endif %}">
        <a href="{% url 'todoHome' %}" class="nav-link">Yapılacaklar</a>
    </li>
    <li class="nav-item d-none d-sm-inline-block {% if url_name == 'paymentsHome' %}active{% endif %}">
        <a href="{% url 'paymentsHome' %}" class="nav-link">Ödemeler</a>
    </li>
    <li class="nav-item d-none d-sm-inline-block {% if url_name == 'specialDaysHome' %}active{% endif %}">
        <a href="{% url 'specialDaysHome' %}" class="nav-link">Özel Günler</a>
    </li>
</ul>
{% endwith %}
{{< /highlight >}}

Hepsi bu kadar, gerisini Python hallediyor sağ olsun. Tabii CSS dosyanızda active class’ınızın olması gerektiğini hatırlatmama gerek yok 🙂




