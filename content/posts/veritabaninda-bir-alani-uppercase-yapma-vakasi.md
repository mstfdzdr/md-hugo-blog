---
title: "Veritabaninda Bir Alani Uppercase Yapma Vakasi"
subtitle: ""
date: 2025-11-14T00:32:06+03:00
lastmod: 2025-11-14T00:32:06+03:00
tags: [oracle]
categories: [veritabani]
featuredImage: ""
featuredImagePreview: ""
draft: false
hiddenFromHomePage: false
toc:
    enable: true
    auto: true
code:
    copy: true
    maxShownLines: 50
---

Calistigim projelerin birinde kullanici veritabanina kurum adini kendi string olarak giriyor. Tabii bu degerin alindigi inputta bir standart konulmamis. Haliyle veriler uppercase, camelcase, lowercase, capitalized words vb. turlu turlu farkli sekilde kaydedilmis. Bu da gunun sonunda veriyi getirip gruplama yaparken problem yaratiyordu. Koyulduk Gemini ile ise :)

Ilk is olarak veriyi degistirmeden once dogru seyi yaptigimdan emin olmam gerek. O yuzden belirli bir id ile select atip hem mevcut veriyi hem de degistirdigimde gormek istedigim veri icin ornekler cagiriyorum.

## Oracle UPPER metodu kullanmak

```sql
    SELECT 
        ADI, 
        UPPER(ADI) AS BUYUK_HARFLI_ADI 
    FROM 
        KURUM 
    WHERE 
        ID = 28;
```

Turkce karakterlerin neredeyse hepsinde ki kucuk i harfini upper yapmak disinda hepsi diyebiliriz calisti aslinda. Fakat belli ki karakter setiyle alakali tam oturmayan bir sey vardi. 

### Turkce karakterler icin Oracle ozel fonksiyonu (NLS_UPPER) denemesi

Türkçe karakterler ('ı', 'i', 'ş', 'ğ', 'ü', 'ö', 'ç') standart UPPER() fonksiyonuyla, veritabanının NLS (National Language Support) ayarlarına bağlı olarak hatalı dönüşebilir. En sık karşılaşılan problem 'i' harfinin 'İ' yerine 'I' olması veya 'ı' harfinin 'I' yerine 'İ' olarak dönüştürülmesidir. Bu sorunu çözmek için Oracle'ın dile özel fonksiyonu olan NLS_UPPER() fonksiyonunu kullanmalısınız. Bu fonksiyon, işlemi yaparken hangi dilin kurallarını baz alacağını belirtmenize olanak tanır.

Simdiki denememiz soyle

```sql
    SELECT 
        ADI, 
        NLS_UPPER(ADI, 'NLS_SORT = TURKISH') AS BUYUK_HARFLI_ADI
    FROM 
        KURUM 
    WHERE 
        ID = 28;
```

#### Veritabanı Ayarlarının Önemi

Basit UPPER(ADI) fonksiyonunun nasıl davranacağı, veritabanınızın veya oturumunuzun NLS_SORT parametresine bağlıdır. Eğer bu parametre zaten TURKISH olarak ayarlıysa, basit UPPER() da doğru çalışabilir.

Ancak NLS_UPPER(..., 'NLS_SORT = TURKISH') kullanmak, bu ayar ne olursa olsun sorgunuzun her zaman doğru çalışmasını garanti altına alır. Bu nedenle özellikle C# veya Java gibi bir uygulamadan (.NET projeniz gibi) sorgu gönderirken bu yöntem en güvenlisidir.

Mevcut ayarlarınızı merak ederseniz şu sorgularla kontrol edebilirsiniz:

```sql
-- Veritabanının varsayılan ayarları
SELECT * FROM NLS_DATABASE_PARAMETERS WHERE PARAMETER = 'NLS_SORT';

-- Sizin mevcut oturumunuzun (session) ayarları
SELECT * FROM NLS_SESSION_PARAMETERS WHERE PARAMETER = 'NLS_SORT';
```

### NLS_UPPER da ise yaramadi. Ufak capli DEBUG yapalim.

Veritabanının bu karakterleri ve fonksiyonları nasıl yorumladığını tam olarak görmemiz gerekiyor. Bu durum, veritabanının kendi NLS_DATABASE_PARAMETERS ayarlarından veya CHARACTERSET (karakter kodlaması) ayarından kaynaklanıyor olabilir. Asagidaki analiz sorgusunu calistirip sonuclari Gemini ile paylastim.

```sql
    SELECT 
        ADI,
        
        -- Verinin ham (byte) dökümü
        DUMP(ADI, 1016) AS DUMP_ORIJINAL, 
        
        -- Standart UPPER fonksiyonunun ham dökümü
        UPPER(ADI) AS STANDART_UPPER,
        DUMP(UPPER(ADI), 1016) AS DUMP_STANDART_UPPER,
        
        -- NLS_SORT denemesinin ham dökümü
        NLS_UPPER(ADI, 'NLS_SORT = TURKISH') AS SORT_DENEMESI,
        DUMP(NLS_UPPER(ADI, 'NLS_SORT = TURKISH'), 1016) AS DUMP_SORT_DENEMESI,
        
        -- NLS_LANGUAGE denemesinin ham dökümü
        NLS_UPPER(ADI, 'NLS_LANGUAGE = TURKISH') AS LANGUAGE_DENEMESI,
        DUMP(NLS_UPPER(ADI, 'NLS_LANGUAGE = TURKISH'), 1016) AS DUMP_LANGUAGE_DENEMESI
    FROM 
        KURUM 
    WHERE 
        SATIRID = 28;
```

**Bu Sorgu Ne Yapıyor?**

- DUMP(..., 1016): Bu fonksiyon, bir metin alanındaki her karakterin tam olarak hangi byte değerleriyle veritabanında saklandığını gösterir.

- "Merkezi" kelimesindeki 'i' harfinin orijinal dökümüne (DUMP_ORIJINAL) ve LANGUAGE_DENEMESI dökümüne (DUMP_LANGUAGE_DENEMESI) bakacağız.

- Eğer LANGUAGE_DENEMESI çıktısındaki harf, "I" (büyük I) harfinin byte koduna dönüşüyorsa, sorun veritabanı kök ayarlarındadır. Eğer "İ" (noktalı büyük İ) harfinin byte koduna dönüşüyorsa, fonksiyon doğru çalışıyor demektir ancak veriyi size gösteren arayüz (SQL Developer, DBeaver, Toad vb.) bunu yanlış yorumluyor olabilir.

#### Analiz Dump Sonucu Sorun Ortaya Cikti

Gemini'nin verdigi cevabi oldugu gibi aktariyorum.


Gelen DUMP sonuçları, tüm fonksiyonların (UPPER, NLS_UPPER (SORT) ve NLS_UPPER (LANGUAGE)) aynı hatalı sonucu ürettiğini kanıtlıyor.

**Orijinal DUMP_ORIJINAL:**

...Merkezi... kelimesindeki i harfinin byte kodu: 69

**Tüm Diğer DUMP Sonuçları:**

...MERKEZI... kelimesindeki I harfinin byte kodu: 49

**WE8ISO8859P9 (Latin-5) karakter setinde:**

- 0x69 = i (küçük noktalı i)

- 0x49 = I (büyük noktasız I)

- 0xDD = İ (büyük noktalı İ) - Olması gereken buydu.

**Sonuç:** *Sizin Oracle  veritabanı kurulumunuzda, NLS_LANGUAGE = TURKISH parametresi bile, i harfini İ harfine (0xDD) dönüştürme kuralını uygulamıyor veya bu kural (NLS tanımı) veritabanında bozuk/eksik. Bu durum, genellikle veritabanı "patch" (yama) seviyesinin eski olmasından veya NLS veri dosyalarının hasar görmüş olmasından kaynaklanabilir.*

#### Çözüm: "Korumalı" Manuel Dönüşüm (Hile Yöntemi)

Madem Oracle'ın yerleşik fonksiyonları bu işi doğru yapmıyor, o zaman biz de bu fonksiyonları "kandırarak" manuel bir düzeltme yapacağız.

Bu yöntemde 3 adım uygulayacağız:

- Bozulan i (küçük i) harfini, UPPER fonksiyonunun dokunmayacağı geçici bir karakterle (mesela CHR(1) gibi) değiştireceğiz.

- NLS_UPPER fonksiyonunu çalıştıracağız. Bu, ğ, ş, ü gibi diğer tüm Türkçe karakterleri ve i dışındaki her şeyi doğruca büyütecek.

- Son olarak, geçici karakterimizi (CHR(1)) olması gereken İ (büyük noktalı İ) harfiyle geri değiştireceğiz.

İşte bu mantıkla çalışan sorgu:

```sql
    SELECT 
        ADI,
        REPLACE(
            NLS_UPPER(
                REPLACE(ADI, 'i', CHR(1)), 
                'NLS_LANGUAGE = TURKISH'
            ), 
            CHR(1), 
            'İ'
        ) AS BUYUK_HARFLI_ADI 
    FROM 
        KURUM 
    WHERE 
        SATIRID = 28;

```

Bingo! Bu calisti. Bundan sonrasi artik ya mevcut ADI kolonunu tum tabloda gezip UPDATE yapmak ya da daha saglama alip yeni kolon olusturup ADI alanini yeni kolona UPPER sekilde atmak. Ben muhtemelen ikincisini tercih edecegim. Karar size kalmis.