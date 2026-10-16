---
title: "GitHub Desktop'ta Çalışan Git, Terminalde Neden \"Authentication failed\" Diyor?"
subtitle: "Şirket içi Azure DevOps Server'da PAT ile Basic kimlik doğrulama"
description: "Azure DevOps Server'da terminaldeki git fetch neden Authentication failed verirken GitHub Desktop çalışıyordu? Yanlış teşhisler ve tek satırlık çözüm."
date: 2026-10-16T14:14:52+03:00
lastmod: 2026-10-16T14:14:52+03:00
# article (default): summary + "read more" on the home page
# snippet: full content on the home page
# video: video + full content on the home page (needs `video`)
postType: article
tags: [git, azure devops, windows, terminal]
categories: ["Nasıl Yapılır"]
featuredImage: ""
draft: false
hiddenFromHomePage: false
toc: true
code:
  maxShownLines: 50
---

Bir mobil projede yeni bir branch açmam gerekiyordu. Sıradan bir iş: `git fetch`, `git branch`, devam. Ama ilk komut şunu verdi:

```text
fatal: Authentication failed for 'https://azuredevops.sirket.local/Koleksiyon/Proje/_git/Proje/'
```

Aynı sunucudaki başka bir repoda da aynı hata vardı. Üstelik GitHub Desktop aynı sunucuya sorunsuz bağlanıyordu. Bu yazı, çözüme giden yolu, yolda yaptığım yanlış teşhisleri ve sonunda sorunu çözen tek satırlık ayarı anlatıyor.

Eğer şirket içinde kurulu bir **Azure DevOps Server** (eski adıyla TFS) kullanıyor ve terminalde bu hatayı alıyorsanız, çözüm büyük ihtimalle sonda.

<!--more-->

## Ortam

- Windows 11, Git for Windows 2.52
- Şirket içi Azure DevOps Server (on-prem), alan adı (domain) hesaplarıyla giriş
- Git Credential Manager (GCM) 2.6.1, yani `credential.helper = manager`
- Kimlik doğrulama için Personal Access Token (PAT)

## İlk bulgu: sunucu ayakta, kimlik reddediliyor

Önce ağ sorununu eledim. Sunucuya basit bir istek attım:

```text
curl -I https://azuredevops.sirket.local/Koleksiyon/Proje/_git/Proje
→ HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer
WWW-Authenticate: Basic realm="https://azuredevops.sirket.local/"
WWW-Authenticate: Negotiate
WWW-Authenticate: NTLM
```

İki şey öğrendim:

1. **VPN/ağ sorunu değil.** Sunucu yanıt veriyor.
2. **Sunucu dört kimlik doğrulama yöntemi sunuyor:** `Bearer`, `Basic`, `Negotiate` ve `NTLM`. Bu satırı aklınızda tutun, hikâyenin anahtarı bu.

## Yanlış teşhis #1: "Ekipte değilsin"

Projenin ekibinde adımın olmadığını fark edip kendimi hem üye hem yönetici olarak ekledim. Mantıklı görünüyordu ama hata aynen devam etti.

Dersi sonradan anladım: Azure DevOps'ta **401** "kimliğin doğrulanamadı" demektir. Yetki sorunu olsaydı **403** ya da `TF401019` gibi bir mesaj görürdüm. Üstelik ekip üyeliği, repo erişimini kendiliğinden vermez, o ayrı bir güvenlik ayarıdır.

PAT'in kendisinin geçerli ve yetkili olduğunu REST API ile ayrıca doğruladım:

```text
curl -u ":PAT" https://azuredevops.sirket.local/Koleksiyon/Proje/_apis/git/repositories/Proje/refs?filter=heads/dev
→ HTTP 200
```

Yani repo okunabiliyordu. Sorun yetkide değildi.

## Yanlış teşhis #2: "Eski kaydı sil"

Windows Credential Manager'da `GitHub - https://azuredevops.sirket.local/...` adlı bir kayıt gördüm ve bayatlamış olduğunu varsaydım. Sildim, GitHub Desktop'ta fetch yapınca giriş sordu, bilgileri girdim ve çalıştı. Ama terminalde hâlâ aynı hata vardı.

Burada ikinci dersi aldım: **GitHub Desktop ve terminaldeki Git aynı sunucuyla konuşuyor ama kimlik bilgisini ayrı yerlerde saklıyor.**

| | Kimlik kaydı adı | Kullanan |
|---|---|---|
| GitHub Desktop | `GitHub - https://sunucu/...` | Kendi Git'i ve kendi kimlik yönetimi |
| Terminaldeki Git | `git:https://sunucu` | Git Credential Manager (GCM) |

Sildiğim kayıt aslında GitHub Desktop'ındı. Terminal Git hiç onu kullanmıyordu. Silmek terminali etkilemediği gibi, Desktop'ın kendi kaydını da gereksiz yere bozmuştu.

## İpucu: GCM izini açmak

GCM bir iz (trace) üretebiliyor:

```powershell
$env:GCM_TRACE = "1"
git fetch origin
```

Çıktının önemli kısmı şuydu:

```text
[GetCredentialAsync] No existing credentials found.
[GenerateCredentialAsync] Checking host for Windows Integrated Authentication...
[GetIsSupportedAsync] Found WWW-Authenticate header for Negotiate
[GetIsSupportedAsync] Found WWW-Authenticate header for NTLM
[GenerateCredentialAsync] Host supports WIA - generating empty credential...
...
[EraseCredentialAsync] No credential was erased.
```

Bu izden iki şey anlaşılıyor:

- GCM kayıtlı bir kimlik bulamıyor.
- Sunucu Windows Integrated Authentication (Windows hesabıyla otomatik giriş) desteklediği için GCM **boş bir kullanıcı adı/şifre** üretip Git'e veriyor ve **bana hiçbir şey sormuyor**. Bu otomatik giriş benim makinemde (alan adına bağlı değil) başarısız oluyor ve hata veriyor.

### Düzeltme 1: Windows otomatik girişini kapatmak

```sh
git config --global credential.https://azuredevops.sirket.local.allowWindowsAuth false
```

Bu işe yaradı, ama yalnızca yarım: artık GCM bir pencere açıp kullanıcı adı ve şifre soruyordu. Girdim ve… yine `Authentication failed`.

## Kimlik bilgisi doğru mu? Git'ten bağımsız test

Aynı kullanıcı adı ve PAT'in gerçekten geçerli olup olmadığını Git'i devre dışı bırakıp `curl` ile sınadım:

```powershell
curl.exe -s -o NUL -w "http=%{http_code}`n" -u "ALANADI\kullanici" "https://azuredevops.sirket.local/Koleksiyon/Proje/_git/Proje/info/refs?service=git-upload-pack"
```

Şifre sorusuna PAT'i yazdım. Sonuç: **`http=200`**.

Kimlik bilgisi doğruydu. Aynı bilgiyle `curl` çalışıyor, `git` çalışmıyordu. Demek ki sorun **Git'in HTTP istemcisinin davranışındaydı**, kimlikte değil. Ayrıca GCM'i tamamen devre dışı bırakıp (`-c credential.helper=`) Git'in kendisine sordurduğumda da aynı hata geldi, yani GCM de suçlu değildi. SSL arka ucunu `openssl`'e çevirmek de bir şey değiştirmedi.

Bu arada istemde dikkatimi çeken bir şey vardı:

```text
Password for 'https://ALANADI%5Ckullanici@azuredevops.sirket.local':
```

`\` karakteri `%5C` olarak görünüyordu ve "belki sorun bu" diye düşündüm. Değildi. Bu yalnızca Git'in kullanıcı adını URL biçiminde göstermesi. Sunucuya çözülmüş hâliyle giden değer `ALANADI\kullanici`.

## Asıl neden: Git en "güçlü" yöntemi seçiyor

`curl -u` doğrudan **Basic** kimlik doğrulama gönderiyor. Git ise farklı çalışıyor: önce kimlik bilgisi olmadan istek atıyor, sunucunun 401 yanıtındaki yöntem listesine bakıyor ve libcurl'ün varsayılan davranışıyla **en güçlü gördüğü yöntemi** seçiyor. Listede `Negotiate` ve `NTLM` olduğu için Basic yerine bunlardan biri seçiliyor. PAT bir NTLM şifresi olmadığı için sunucu reddediyor.

Başta gördüğüm dört satırlık `WWW-Authenticate` listesi tam olarak buydu.

## Çözüm: Basic'i baştan göndermeye zorlamak

Git 2.46 ile gelen `http.proactiveAuth` ayarı, ilk istekte yöntem pazarlığı yapmadan doğrudan belirtilen kimlik doğrulamayı göndermeyi sağlıyor:

```sh
git -c credential.helper= -c http.proactiveAuth=basic fetch origin
```

Kullanıcı adı ve PAT'i girdim. Bu sefer `fatal` yoktu, komut sessizce bitti. Çalışmıştı.

Kalıcı yapmak için, yalnızca ilgili sunucuya özel olarak:

```sh
git config --global http.https://azuredevops.sirket.local.proactiveAuth basic
git fetch origin
```

İkinci komutta GCM penceresi bir kez açılıp kullanıcı adı ve PAT'i sordu, kaydetti. Sonrasında aynı sunucudaki diğer repolarda da tekrar sormadan çalıştı.

## Özet: tek başına yeterli olan ayarlar

Benim durumumda gereken iki ayar buydu. Sorunu asıl çözen `proactiveAuth` oldu:

```sh
git config --global http.https://azuredevops.sirket.local.proactiveAuth basic
git config --global credential.https://azuredevops.sirket.local.allowWindowsAuth false
```

`allowWindowsAuth false`, GCM'in boş (WIA) kimlik üretip hiçbir şey sormamasını engelliyor. `proactiveAuth basic` ise Git'in Basic yerine Negotiate/NTLM'e takılmasını önlüyor. Kurulumunuzda `allowWindowsAuth` ayarına ihtiyaç olmayabilir, ama iz çıktısında "Host supports WIA" görüyorsanız ikisini birlikte ayarlamak güvenli.

## Çıkardığım dersler

1. **401 ile 403 aynı şey değil.** 401 kimlik doğrulama, 403 yetki sorunudur. Ekibe kendimi eklemek gereksiz bir yan yoldu.
2. **Hatanın hangi katmanda olduğunu ayırın.** `curl` (200) ile `git` (hata) arasındaki fark, sorunu "kimlik bilgisi" katmanından "Git'in HTTP davranışı" katmanına taşıdı. Bu tek karşılaştırma yüzlerce tahminden değerliydi.
3. **GitHub Desktop çalışıyor diye terminal çalışacak demek değil.** İkisi kimlik bilgilerini ayrı yerlerde saklıyor ve farklı Git ikilileri kullanabiliyor. Bir kaydı silmeden önce hangi aracın kaydı olduğundan emin olun.
4. **İz (trace) açın.** `GCM_TRACE=1` ile "boş kimlik üretildi" satırını görmek, GCM'in neden hiçbir şey sormadığını açıkladı.
5. **Sunucunun `WWW-Authenticate` listesine bakın.** Aynı anda `Basic` ve `Negotiate/NTLM` sunan on-prem sunucularda PAT ile Git kullanıyorsanız bu hatayı tekrar görebilirsiniz.

## Hızlı kontrol listesi

Aynı hatayı alıyorsanız sırayla:

1. `curl -I <repo-url>` ile 401 ve `WWW-Authenticate` başlıklarını görün.
2. `curl.exe -u "ALANADI\kullanici" <repo-url>/info/refs?service=git-upload-pack` ile kimlik bilgisini Git'ten bağımsız doğrulayın. `200` bekliyoruz.
3. `GCM_TRACE=1 git fetch` ile GCM'in ne yaptığına bakın. "generating empty credential" görüyorsanız `allowWindowsAuth false` ekleyin.
4. Hâlâ başarısızsa `git -c credential.helper= -c http.proactiveAuth=basic fetch` deneyin.
5. Çalışırsa `proactiveAuth basic` ayarını ilgili sunucuya özel kalıcı yapın.

Umarım bir sonraki sefer bu hatayla uğraşan biri bu yazı sayesinde saatler kazanır.

> [!NOTE] Not
> Yazıdaki sunucu ve alan adları anonimleştirilmiştir. PAT'i hiçbir zaman komut satırına veya URL'ye açık yazmayın, etkileşimli giriş ya da kimlik yöneticisi kullanın.
