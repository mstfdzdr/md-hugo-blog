---
title: "macOS 27’de Shottr Neden Kapanıyordu? Sorunun Suçlusu Hiç Beklemediğim Bir Uygulamaydı"
subtitle: ""
date: 2026-10-08T23:54:21+03:00
lastmod: 2026-10-08T23:54:21+03:00
# article (default): summary + "read more" on the home page
# snippet: full content on the home page
# video: video + full content on the home page (needs `video`)
postType: article
tags: [macos]
categories: []
featuredImage: ""
draft: false
hiddenFromHomePage: false
toc: true
code:
  maxShownLines: 50
---

 Bir süredir Mac'imde ekran görüntüsü almak için **Shottr** kullanıyorum. Hafif, hızlı ve ihtiyacım olan hemen her şeyi yapan bir uygulama. Özellikle ekran görüntülerinin üzerine hızlıca ok, kutu veya blur eklemek için oldukça pratik.

 Fakat macOS 27'ye geçtikten sonra garip bir sorun yaşamaya başladım.

 Shottr normalde macOS'un menu bar'ında sessizce çalışmaya devam ediyor. Bir screenshot aldığımda Shottr penceresi açılıyor, işimi yapıyorum ve pencereyi kapatıyorum. Uygulama ise arka planda çalışmaya devam ediyor.

 En azından normalde böyle olması gerekiyor.

 Bende ise pencereyi kapattığım anda **Shottr da tamamen kapanıyordu.**

 İlk başta bunun macOS 27 ile ilgili bir uyumluluk problemi olduğunu düşündüm.

 Ama yanılmışım.

 Asıl suçlu, hiç aklıma gelmeyen başka bir uygulamaydı.

 ## Shottr neden kapanıyor?

 Sorun oldukça basitti:

 > Screenshot penceresini kapatıyorum → Shottr menu bar'dan kayboluyor → Shottr tamamen kapanıyor.

 Üstelik uygulamayı tekrar açtığımda her şey normal çalışıyordu.

 Bir screenshot daha alıyordum, pencereyi kapatıyordum ve Shottr yine kapanıyordu.

 Bu davranış macOS 27'ye geçtikten sonra ortaya çıktığı için doğal olarak ilk şüphelim macOS oldu.

 ### İlk şüpheli: macOS 27

 Bu şüphe aslında tamamen yersiz değildi.

 Shottr'ın yeni sürümlerinde macOS 27 için uyumluluk düzeltmeleri bulunuyordu. Ben de zaten Shottr'ın **1.9.3** sürümünü kullanıyordum.

 Ayrıca macOS 27 ile birlikte bazı menu bar ve arka plan uygulamalarında çeşitli uyumluluk problemleri raporlanıyordu.

 Dolayısıyla ilk teorim şuydu:

 > "Muhtemelen macOS 27, menu bar uygulamalarının çalışma şeklinde bir değişiklik yaptı ve Shottr bundan etkilendi."

 Fakat bir şeyi doğrulamam gerekiyordu:

 **Shottr gerçekten kapanıyor muydu, yoksa sadece menu bar ikonu mu kayboluyordu?**

 ## İlk Terminal testi

 Bunu anlamanın en kolay yolu çalışan process'lere bakmaktı.

 Terminal'i açıp şu komutu çalıştırdım:

```
pgrep -alf Shottr
```

 Normalde Shottr çalışıyorsa burada bir sonuç görmemiz gerekiyor.

 Fakat Shottr kapandıktan sonra komut hiçbir şey döndürmedi.

 Bu önemliydi.

 Çünkü Shottr sadece menu bar'dan kaybolmuyordu.

 **Process gerçekten kapanmıştı.**

 ## Crash report da yoktu

 Sonraki adım macOS'un Crash Reports bölümüne bakmaktı.

 Ama orada da Shottr'a ait herhangi bir crash raporu yoktu.

 Bu durumda elimizde ilginç bir tablo oluştu:

 - Shottr çalışıyor.
- Screenshot alıyorum.
- Shottr penceresini kapatıyorum.
- Shottr tamamen kapanıyor.
- `pgrep -alf Shottr` sonuç vermiyor.
- Crash report oluşmuyor.

 Peki Shottr neden kapanıyordu?

 Burada artık tahmin etmek yerine macOS'un kendi loglarına bakmaya karar verdim.

 ## macOS loglarını Terminal'den izlemek

 Terminal'de şu komutu çalıştırdım:

```
log stream --style compact --level info --predicate 'process == "Shottr" OR eventMessage CONTAINS[c] "Shottr"'
```

 Bu komut macOS'un loglarını canlı olarak izlememizi sağlıyor.

 Terminal açık kaldı.

 Sonra Shottr'ı tekrar açtım.

 Bir screenshot aldım.

 Pencereyi kapattım.

 Shottr yine kapandı.

 Ve Terminal'deki loglara baktım.

 İşte burada işler ilginçleşmeye başladı.

 ## Shottr crash olmuyordu

 Loglarda şu satırı gördüm:

```
[com.apple.AppKit:Application] Attempting sudden termination (2nd attempt)
```

 Hemen ardından:

```
[com.apple.AppKit:Application] Termination complete. Exiting without sudden termination.
```

 Daha sonra da:

```
LSExitStatus=0
```

 ve:

```
Process exited: <RBSProcessExitContext| voluntary>.
```

 Buradaki **voluntary** kelimesi özellikle dikkat çekiciydi.

 Shottr crash olmamıştı.

 macOS da Shottr'ı zorla öldürmüş gibi görünmüyordu.

 Process normal bir şekilde sonlanmıştı.

 Yani soru artık şuydu:

 > **Shottr neden kendisini kapatıyor?**

 ## Loglarda beklenmedik bir isim

 Logları biraz daha dikkatli inceleyince başka bir uygulamanın adı gözüme çarptı:

 **Vorssaint.**

 Üstelik bu uygulama benim Mac'imde çalışan uygulamalardan biriydi.

 Vorssaint'in amacı Mac'te kullanılmayan uygulamaları otomatik olarak kapatmaya yardımcı olmak.

 O anda taşlar yerine oturmaya başladı.

 Acaba Shottr, Vorssaint tarafından "artık kullanılmıyor" olarak değerlendirilip otomatik olarak kapatılıyor olabilir miydi?

 Bunu anlamanın en kolay yolu vardı.

 ## En basit test: Vorssaint'i kapat

 Vorssaint'i tamamen kapattım.

 Sonra Shottr'ı tekrar çalıştırdım.

 Screenshot aldım.

 Shottr penceresini kapattım.

 Ve...

 **Shottr kapanmadı.**

 Menu bar'da durmaya devam etti.

 Bir screenshot daha aldım.

 Pencereyi kapattım.

 Yine kapanmadı.

 Sorun çözülmüştü.

 ## Sorunun gerçek nedeni

 Başlangıçta düşündüğüm senaryo şuydu:

```
macOS 27
   ↓
Shottr uyumluluk problemi
   ↓
Shottr kapanıyor
```

 Ama gerçek durum şuymuş:

```
Shottr çalışıyor
   ↓
Screenshot penceresi kapanıyor
   ↓
Vorssaint Shottr'ı kullanılmayan bir uygulama olarak değerlendiriyor
   ↓
Shottr kapanıyor
```

 Yani problem doğrudan **macOS 27 veya Shottr'ın crash olması değildi.**

 Shottr, başka bir uygulama tarafından otomatik olarak sonlandırılıyordu.

 ## Terminal logları neden bu kadar faydalı oldu?

 Bu olayın güzel tarafı, tahmin ederek çözmeye çalışmak yerine macOS'un bize aslında cevabı loglarda vermesiydi.

 Örneğin:

```
LSExitStatus=0
```

 Shottr'ın klasik bir crash ile kapanmadığını gösteren önemli ipuçlarından biriydi.

 Şu satır ise daha da açıklayıcıydı:

```
Process exited: <RBSProcessExitContext| voluntary>.
```

 Ve `pgrep` testi de Shottr'ın gerçekten process olarak ortadan kalktığını doğruladı.

 En sonunda loglarda Vorssaint'i görünce şüphelenecek somut bir noktamız oldu.

 Vorssaint'i kapatıp tekrar deneyince de teşhis doğrulandı.

 ## Eğer siz de macOS 27'de Shottr'ın kapandığını görüyorsanız

 Eğer siz de macOS 27'ye geçtikten sonra Shottr'ın screenshot penceresini kapattığınızda tamamen kapandığını fark ettiyseniz, doğrudan Shottr'ı silip yeniden yüklemeden önce arka planda çalışan **otomatik uygulama kapatma araçlarını** kontrol etmekte fayda var.

 Özellikle Vorssaint gibi uygulamalar bu davranışın nedeni olabilir.

 Öncelikle Shottr'ın gerçekten çalışıp çalışmadığını kontrol etmek için:

```
pgrep -alf Shottr
```

 kullanabilirsiniz.

 Daha sonra Shottr'ın macOS loglarını canlı olarak görmek için:

```
log stream --style compact --level info --predicate 'process == "Shottr" OR eventMessage CONTAINS[c] "Shottr"'
```

 komutu oldukça kullanışlı.

 Shottr kapandığında özellikle şu tür satırlara bakabilirsiniz:

```
Termination complete
```

```
LSExitStatus=0
```

```
Process exited: ... voluntary
```

 Bunlar uygulamanın klasik bir crash sonucu kapanmadığını anlamaya yardımcı olabilir.

 ## Sonuç

 Bu küçük problem bana bir kez daha şunu hatırlattı:

 **Bir uygulamanın kapanması her zaman uygulamanın çöktüğü anlamına gelmiyor.**

 Özellikle macOS'ta arka planda çalışan uygulamalar söz konusu olduğunda Login Items, LaunchServices, RunningBoard ve diğer yardımcı uygulamalar sürece dahil olabiliyor.

 Ben de ilk başta macOS 27'yi suçladım.

 Shottr'ın yeni macOS sürümüyle uyumluluğunu araştırdım.

 Crash report'larına baktım.

 Process'i kontrol ettim.

 Sonunda Terminal'deki macOS loglarını takip ettim.

 Ve birkaç satırlık log sayesinde problemin aslında **Vorssaint'in Shottr'ı otomatik olarak kapatması** olduğunu buldum.

 Kısacası:

 > **Shottr bozulmamıştı. macOS da Shottr'ı öldürmüyordu. Sadece Vorssaint biraz fazla işini iyi yapıyordu.** 😄
