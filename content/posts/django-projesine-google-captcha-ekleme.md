---
title: "Django Projesine Google Captcha Ekleme"
subtitle: ""
date: 2021-10-19T15:58:12+03:00
lastmod: 2023-01-30T15:58:12+03:00
tags: ["google captcha"]
categories: ["Django"]
featuredImage: ""
featuredImagePreview: ""
draft: true
toc:
    enable: false
    auto: false
code:
    copy: true
    maxShownLines: 50
---

Öncelikle {{< link href="https://github.com/nodesource/distributions" content="Google Captcha" >}} adresine gidip dökümantasyon kısmına ulaşalım.
Burada kullanabileceğimiz iki versiyon (reCAPTCHA v2 ve reCAPTCHA v3) bulunmakta.
Ben klasik “ben robot değilim” butonu şeklinde ekleme yapmak istediğim için reCAPTCHAv2’yi kullanacağım.

{{< link href="https://github.com/nodesource/distributions" content="reCAPTCHA Admin" >}}‘e tıklayarak gerekli alanları dolduralım.
Bunlar site yönetici e-postaları, kontrol edilecek domainler vb. Daha sonra Google bize iki adet KEY verecek.
Bunlardan biri front-end için diğeri yani SECRET KEY yazan ise back-end için.

Projemizin captcha kontrolü nerede yapmasını istiyorsak o sayfanın templates klasöründeki html dosyasına gelip uygun bir yere aşağıdaki html kodunu yerleştirmeli ve data-sitekey özelliğini kendi keyiniz ile doldurmalısınız.

{{< highlight html >}}
<div class="g-recaptcha" data-sitekey="GOOGLE_TARAFINDAN_VERILEN_SITE_KEY"></div>
{{< /highlight >}}

Daha sonra API’ın çalışması için gerekli script kodunu da ekleyelim. Dosyanın sonunda gönderdiğimiz parametre captcha aracının Türkçe yerelleştirilmesi için gerekli.

{{< highlight html >}}
<script src="https://www.google.com/recaptcha/api.js?hl=tr"></script>
{{< /highlight >}}

Gelelim back-end tarafına.

{{< highlight python >}}
captcha_token = request.POST.get("g-recaptcha-response")
captcha_url="https://www.google.com/recaptcha/api/siteverify"
captcha_secret_key = "GOOGLE_TARAFINDAN_VERILEN_SECRET_KEY"
captcha_data = {"secret":captcha_secret_key, "response":captcha_token}
captcha_server_response = requests.post(url=captcha_url, data=captcha_data)
captcha_json=json.loads(captcha_server_response.text)
if captcha_json['success']== True:
#BURASI CAPTCHA ONAYI ALINDI İSE GERÇEKLEŞECEK
else:
#BURASI CAPTCHA ONAYI ALINMADI İSE GERÇEKLEŞECEK
{{< /highlight >}}

İster bunu ayrı bir metot yaparsınız ister bir metodun içine ekler if’e göre kontrol edersiniz. Seçim size kalmış.