# Bu site nasıl çalışıyor?


Bilmediğim bilmediğim işler :) Oraya bak burdan oku derken nihayet canlıya çıkarabildim blogu. Ama nasıl...

<!--more-->
## Hugo Kurulumu

[Hugo](https://gohugo.io/) ana sayfasından sistemime uygun olan Hugo versiyonunu seçerek işe başladım. Windows için bana bir zip dosyası indirtti. İçerisinde üç adet dosya var.

* hugo.exe
* LICENSE
* README.md

Bu dosyaları **tavsiyem** kök dizinde bir klasöre koymanız. Tabii klasör de önemli. Kök dizinden kastım ise şu örneğin direkt C diskine ya da D diskine koymak gibi. Ben mesela D diskine koydum.

D diskinde önce **Hugo**, onun içerisine de **bin** klasörü açtım ve bu üç dosyayı oraya çıkarttıp zip arşivinden. Yani tam dosya yolu **D:/Hugo/bin**

### Windows 10'da Hugo için PATH ekleme

Hugo'ya herhangi bir terminal uygulamasından ulaşmak için Windows PATH yollarına onu eklememiz gerekiyor. Bunun için sırasıyla:

1. Masaüstündeki **Bilgisayarım** ya da **Bu Bilgisayar** yazan simgeye sağ tıklayın ve özellikler deyin.

2. Açılan pencereden sol panelde bulunan **Gelişmiş Sİstem Ayarları**na sol tıklayın.

3. Karşımıza **Sistem Özellikleri** isimli bir pencere açacak ve bu pencerenin altındaki butonlardan birinde **Ortam Değişkenleri** yazacak. Bu butona tıklayalım :)

4. Ortam değişkenleri penceresinde **Path** diye bir değişken göreceksiniz. Görmüyorsanız yeni butonu ile siz oluşturabilirsiniz.

5. Daha sonra **path** seçili iken, düzenle butonu ile ortam değişkenini düzenle penceresini açalım.

6. Yeni butonuna tıklayıp Hugo/bin klasörümüzün tam yolunu buraya yazalım.

Tamam dediğimizde artık herhangi bir terminal penceresinde **hugo** komutuna tepki alabiliyor olmanız gerek.

### Editör seçimi ve alternatifler

Bu adım aslında tamamen kişisel tercih. Benim önerim Visual Studio Code'dan yana. O yüzden burdan sonrasında Visual Studio'dan örneklerle devam edeceğim.

[indirme linki](https://code.visualstudio.com/download)

### Hugo ile site oluşturma

Hugo'yu kurmak istediğiniz klasöre terminalle ulaşın ve **hugo new site KLASÖRADI** yazıp enterlayın.

Sonra KLASÖRADI klasörünün içerisinde terminalde **hugo serve -D** komutunu yazdığınızda localhostta çalışacak şekilde hugo ayağa kalkacaktır.

#### Siteye tema eklemek

Benim gibi sürekli komşunun bahçesi size de daha yeşil geliyorsa işiniz zor. Derya deniz tema alternatifi var. [Şuradan](https://themes.gohugo.io/) göz atıp birini seçin.

Tavsiyem kurulum için her temanın kendi dökümantasyonunu okumanız ama genel itibariyle şöyle kuruluyor tema: **git clone TEMANINGİTADRESİ.git**. Tabii bunları terminalde yazıyoruz unutmayın :)

## Github Pages

Pages aslında size kullanıcıAdınız.github.io uzantılı domain sağlayarak HTML dosyalarınızı yayınlayabileceğiniz bir Github reposu.

Zaten Hugo'nun mantığı da şu: siteyi hugo reposunda oluşturduktan sonra github.io reposuna html çıktı vermek.

### Repo ayarları

Github hesabınızda bu mevzu için iki ayrı repo oluşturmanız lazım. Biri hugo için diğeri zaten Github Pages için oluşturduğunuz kullanıcıAdınız.github.io olan repo.

### Repoya upload

Hugo için oluşturduğunuz klasöre bundan sonra **HUGOKLASOR** diyeceğim.

Hugo için oluşturduğunuz github reposuna bundan sonra **HUGOREPO** diyeceğim.

HUGOKLASOR içindeyken terminalde sırasıyla:

1. git init

2. git remote add origin git@github.com:kullanıcıAdınız/HUGOREPO.git

3. git add .

4. git commit - m "Hugoyu upload ediyoruz"

5. git submodule add git@github.com:kullanıcıAdınız/kullanıcıAdınız.github.io.git

6. git add .

7. git commit -m "HTML zimbirtilari icin ilk commit"

8. git push -u origin master

Her adımdan sonra enterlayarak kodu terminale yollamayı unutmayın. Yavaş yavaş yapın kafanız karışmasın.

#### Permission Denied (publickey) hatası aldım

Bu aslında bilgisayarınıda ***SSH Key** yok demek. Aşağıdaki adımlarla bilgisayarımıza ssh key oluşturup, github'a ekleyeceğiz bunu.

1. Git Bash programını açın. Mac ve Linux'ta bu kendi terminal uygulaması üzerinden de yapılabiliyor(muş).

2. **cd ~/.ssh** komutunu yazın. Bu komut sizi şuraya götürecek. "C:\Kullanıcılar\KULLANICIADINIZ\ .ssh\"

3. Bu klasörün içinde .ssh uzantılı iki dosya olmalı. **id_rsa** ve **id_rsa.pub**. Bu iki dosyayı burada göremiyorsanız aşağıdaki adımla devam ediyoruz.

4. SSH key dosyalarını oluşturmak için git bash'te şunu yazıyoruz: **ssh -keygen -t rsa -C "MAİL ADRESİNİZ"**

    {{< admonition warning "Önemli Hatırlatma" >}}
    E-posta adresiniz github'daki birincil mail adresiniz olsun.
    {{< /admonition >}}

5. Son adımdan sonra bahsi geçen klasörde üçüncü adımda ismini belirtiğim dosyaların oluştuğunu göreceksiniz.

6. **id_rsa.pub** dosyasını herhangi bir metin editörü ile açın ve içeriğini kopyalayın.

7. Kopyaladığınız içeriği Github hesabınızın **Account Settings** altında SSH Keys kısmına ekleyin.

8. Şimdi tekrar bu hatayı aldığınız terminal kodunu çalıştırın. Artık çalışacaktır.

Şimdi sırada hugo sitemizin ayarlarının bulunduğu **config.toml** dosyasında url işlemlerini düzeltmek var. Muhtemelen en üstteki satırda bulabileceğiniz **baseURL** ve **publishDir** kısmını aşağıdaki gibi düzeletecek ve kaydedeceğiz. Kaydettikten sonra terminalde **hugo** komutu çalıştırmayı unutmayın.

* baseURL = "https://kullanıcıAdınız.github.io"

* publishDir = "kulllanıcıAdınız.github.io"

Bu adımdan sonra HUGOKLASOR içerisinde kullanıcıAdınız.github.io uzantılı bi klasör daha olacak. Hugonun render ettiği HTML dosyaların içerisinde olduğunu göreceksiniz.

### Dosyaları yollama

kullanıcıAdınız.github.io klasörüne girdikten sonra terminalde sırasıyla:

1. git add .

2. git commit -m "hello hugo!"

3. git push origin master

### Yeni posttan sonra ne yapacağız

Her yeni posttan sonra **hugo** komutu ile siteyi derleyip html renderı almak ve sonra üstteki dosyaları yollama adımlarını tekrar yapmak sitenizi güncel kılacaktır.

{{< admonition quote "Kaynaklar" false >}}

1. [kayaen.github.io](https://kayaen.github.io/blog/2019-02/bu-sitenin-kurulumu/)

2. [levelup](https://levelup.gitconnected.com/build-a-personal-website-with-github-pages-and-hugo-6c68592204c7)
{{< /admonition >}}

