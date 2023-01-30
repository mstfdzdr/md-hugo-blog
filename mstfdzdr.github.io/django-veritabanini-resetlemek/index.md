# Django: Veritabanını Resetlemek


Bir proje olgunlaşırken gerek db model üzerinden gerekse data üzerinde sürekli değişiklikler oluyor ve bir yerden sonra test için veri çok anlamsız hâle gelebiliyor. Bu gibi durumlarda veritabanınızı resetlemek (sıfırlamak) ihtiyacı doğabilir. Bunun için birkaç farklı yöntem bulunuyor.
<!--more-->

### SQLite3 Dosyasını Kaldırmak
Eğer veritabanınız bir sqlite3 dosyasından ibaret ise dosyayı ve migration python dosyalarını silmek işe yarayacaktır. Sırasıyla:

* veritabanı.sqlite3 dosyasını silin (yedeksiz iş yapmayın, dosyayı bir kenara yedek alın yine de 🙂 ).
* Django projeniz içerisindeki migrations klasörüne gidin ve içindeki oluşturulan migration dosyalarını silin (Bu işlem tek tek migrationları geri almak vb. işlemleri artık geçersiz kılar, unutmayın!).
* Sonra projenizi açıp, makemigrations ve migrate komutlarını uygulayın.

### Veritabanını Sıfırlamak
Bu işlem ise, superuser dahil tablolarınızdaki tüm verileri silmeye yarıyor. Yapmanız gereken sadece aşağıdaki kodu uygulamak. Kod macOS ortamı için. Windowsta python3 yerine python vs. yazmanız gerekebilir.

{{< highlight bash >}}
python3 manage.py flush
{{< /highlight >}}

### Uygulamanın Tablolarını Sıfırlamak
Eğer sadece projenizin altındaki bir uygulamanın tablolarını kaldırmanız gerekiyorsa da aşağıdaki kodu çalıştırmanız gerekiyor.

{{< highlight bash >}}
python3 manage.py migrate UygulamaAdi zero
{{< /highlight >}}

{{< admonition type=warning title="UYARI" open=true >}}
Tüm işlemlerden önce dataların **yedeğini** mutlaka alın.
{{< /admonition >}}
