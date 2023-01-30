# Yeni Django Projesine Başlamak


Herkese selam, bu yazı aslında kendime not gibi olacak çünkü her yeni projeye başlarken komutları biliyor da
olsam teyit etmek amaçlı dokümantasyonlardan kontrol ediyorum. Bu yüzden derli toplu bir şekilde blogta dursun istedim.
<!--more-->
Tüm adımlara başlamadan önce işletim sisteminizde Python kurulu olmalı. İşletim sisteminize göre bu süreç değişebilir,
Windows’ta exe dosyası ile kurulum, Linux ve Mac’te genelde Python kurulu gelse de güncel olmuyor, onlara da terminal
yardımıyla kurulum yapıyoruz. He Windows’a terminalden kuramaz mıyız? Kurarız ama önce
{{< link href="https://docs.python.org/3/library/calendar.html#calendar.monthrange" content=chocolatey.org >}} adresinden chocolatey kurmak lazım falan.
Neyse tüm bu adımları geçtiğimizi ve işletim sistemi environment’imizde **Python 3** kurulu olduğunu varsayıyorum.

### Virtual Environment Kurulumu
Her projede farklı bağımlılıklarınız olabilir, farklı paketler ya da aynı paketlerin farklı sürümleri.
O sebeple global ortama kurmak yerine proje özelinde sanal bir environment (Bunun da Türkçe’si çevre, ortam falan diye geçiyor.
Sevmiyorum o yüzden Türkçe’sini kullanmayı) kurmak en sağlıklısı. Bunu yapmak için Python’a dahil olan venv kütüphanesini kullanacağız.

Windows için:

```bash
python -m venv env
```
Linux ya da macOS için:

```bash
python3 -m venv env
```

Burada dikkat etmek gereken nokta şu: venv’den sonra gelen env aslında environment’inizi için verdiğiniz ad.
Yani oraya ali, veli vb. her şeyi yazabilirsiniz. Genelde ***projeAdiEnv*** tarzı kullanım işinizi görecektir.

### Virtual Environment'ı Etkinleştirmek
Environment’i etkinleştirmemiz lazım ki pip yardımı ile kuracağımız paketler buraya kurulsun.

Windows için:

```bash
env\Scripts\activate.ps1
```

Linux ya da macOS için:

```bash
source env/bin/activate
```

Tabii buradaki env yazan yerlerin kendi environment klasörünüzün adıyla aynı olması gerektiğini hatırlatmama gerek yoktur herhalde 🙂
Eğer her şey yolunda gittiyse terminal ekranınızda (env) yani environment klasörünün ismi yazmalı.

#### Virtual Environment'a Paket kurmak

Yani burası isteğe göre değişebilir. Django dediğimiz için sadece Djangoyu kuracağız aşağıdaki şekilde. O Django için gerekli paketleri de kuracak zaten.

```bash
pip install django
```

{{< admonition type=tip title="Ek not" open=true >}}
Eğer projeye sıfırdan girişmiyorsanız ve projenin kendine ait bir bağımlılıklar dosyası (requirements.txt) varsa şunu yaparak bu dosya içindekileri kurabiliriz.
{{< /admonition >}}

```bash
pip install -r requirements.txt
```

### Django Projesini Oluşturmak
Environment ortamına gerekli kurulumları yaptığımıza göre sıra geldi Django’ya. Django ile projemizi oluşturalım.

```bash
django-admin startproject ProjeAdi .
```
Proje klasörünün içine girelim.

```bash
cd ProjeAdi
```

Proje klasöründe manage.py gibi dosyaları görüyor olmanız gerek. Django uygulamaları doğası gereği en az bir app ile çalışmakta. O sebepten bir de app’imizi kuralım.

Windows için:

```bash
python manage.py startapp AppAdi
```

Linux ya da macOS için:

```bash
python3 manage.py startapp AppAdi
```

Evet neredeyse hazırız. Bundan sonrası app’i Django projesine eklemek falan. Onları da başka yazıya artık 🙂


