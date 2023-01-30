# Ubuntu üzerinde web geliştirici ortamı kurmak


Ara ara live usb ya da virtual machine üzerinden deneyimlerim olsa da kalıcı olarak Linux kullanma fırsatım olmamıştı.
Geçtiğimiz senenin sonunda nihayet bir masaüstü bilgisayar alınca notebooku farklı işletim sistemleri test etmek amaçlı kullanmaya başladım.

Amacım macOS’a ulaşamayan içimdeki junior developer’ı Windows‘a göre daha rahat edebileceğim bir ortamda kodlamak için Ubuntu kurmak idi.
Yazının bundan sonrası esasında bir anlamda kendime sonraki kurulumlarda rehber şeklinde 🙂
<!--more-->

### Terminal ve sistemi güncelleme
Öncelikle Linux dedik mi olayımız terminal. O yüzden önce terminali kullanarak sistem için güncellemeler , yükseltmeler var mı onu kontrol edelim.

{{< highlight bash >}}
sudo apt update && sudo apt -y upgrade
{{< /highlight >}}

### Node.js

Burada Node.js’in sürümünü özellikle seçmek istiyorsanız aşağıdaki komut satırı yerine {{< link href="https://github.com/nodesource/distributions" content=şuradan >}} github reposuna göz atmalısınız.

{{< highlight bash >}}
sudo apt-get install nodejs
{{< /highlight >}}

Nodejs’i github reposundan indirmekte hata alırsanız curl kurmanız gerek. O yüzden aşağıdaki kodu çalıştırın.

{{< highlight bash >}}
sudo apt-get install curl
{{< /highlight >}}
Node sürümünü görmek için terminalde **node -v** npm sürümünü görmek için ise **npm -v** yazabilirsiniz.

### Apache

Apache web server’ı ayağa kaldırmak gerek.

{{< highlight bash >}}
sudo apt-get install apache2
{{< /highlight >}}
Bu adım tamamlandıktan sonra web tarayıcınızın adres çubuğuna localhost yazın ve Apache Home Page’ı görün.

### PHP
Apache2 modlu PHP paketi kuruyoruz.
{{< highlight bash >}}
sudo apt-get install php libapache2-mod-php
{{< /highlight >}}
Sonucu görmek için terminalde **php -v** yazabilirsiniz.

PHP kurulumundan sonra apache servisini yeniden başlatmanız gerek. Onun için ise:

{{< highlight bash >}}
sudo service apache2 restart
{{< /highlight >}}

Bu aşamadan sonra apache klasörünüzde (muhtemelen: ***/var/www/html/***) dosya izinlerini kendi kullanıcınız için almanız gerekecek. Bunun için ise:

{{< highlight bash >}}
sudo chown KULLANICIADINIZ:KULLANICIADINIZ -R ./
{{< /highlight >}}

Kontrol etmek için terminalde ***ls -la*** komutunu deneyebilirsiniz.

Daha sonrasında bir yetki işlemi daha yapmalıyız. Bunu apache klasöründeki envvars dosyası üzerinde satırlar değiştirerek yapacağız. Komutumuz şöyle:
{{< highlight bash >}}
sudo gedit /etc/apache2/envvars
{{< /highlight >}}

Açılan dosyada aşağıdaki görselde gördüğünüz kısımların varsayılan hali www-data şeklinde olacaktır. Siz ***KULLANICIADINIZ*** olarak değiştirmelisiniz.

{{< figure src="/images/apache-ayar.png" >}}

Sonra tekrar apache’yi yeniden başlatıyoruz.

{{< highlight bash >}}
sudo service apache2 restart
{{< /highlight >}}

### MySQL

Eee veritabanı olmadan olmaz.

{{< highlight bash >}}
sudo apt-get install mysql-server
{{< /highlight >}}

Her şey yolunda mı diye kontrol etmek için:
{{< highlight bash >}}
sudo service mysql status
{{< /highlight >}}

### PHPMyAdmin

{{< highlight bash >}}
sudo apt-get install phpmyadmin
{{< /highlight >}}

Kurulum esnasında gelecek Configuring phpmyadmin penceresinde **boşluk tuşu** ile apache2‘yi işaretliyoruz.
Sonrasında gelecek pencerede *“Configure database for phpmyadmin with dbconfig-common?”* sorusuna da ***Yes*** deyip devam ediyoruz.
Bir sonraki aşamada MySQL için bizden parola oluşturmamızı isteyecek. Şifrenizi oluşturun ve sonrasında tekrar aynı şifreyi girerek onaylayın.

Web tarayıcınızdan localhost/phpmyadmin adresine girmeyi deneyin. Bir giriş ekranı ile karşılaşacaksınız. Buradaki kullanıcı adımız root.
Şifreyi ise terminalde aşağıdaki kodları girerek tanımlıyoruz. (Parola phpmyadmin yüklerken girdiğiniz parola ile eşleşmeli!)

{{< highlight bash >}}
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'PAROLANIZ';
{{< /highlight >}}

### IDE ve Browser

Buraya kadar her şey yolunda gitti ise kodlamaya başlamak için {{< link href="https://github.com/nodesource/distributions" content="Visual Studio Code" >}},
ortaya çıkanları görmek için ise {{< link href="https://github.com/nodesource/distributions" content=Brave >}} tarayıcıyı öneririm.



