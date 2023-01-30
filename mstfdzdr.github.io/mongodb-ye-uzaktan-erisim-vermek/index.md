# MongoDB'ye Uzaktan Erişim Vermek


Windows sunucuda çalıştırdığımız MongoDB’ye uzaktan erişmemiz gerekti. Nasıl yapılır diye araştırırken, buraya da not alayım istedim.
<!--more-->

### mongod.cfg dosyası düzenleme

Mongodb’nin Windows servisi olarak çalıştığından emin olduktan sonra, aşağıdaki yola ulaşıp herhangi bir not editörüyle mongod.cfg dosyasını açalım.

```bash
C:\Program Files\MongoDB\Server\4.4\bin
```

Server klasörü altındaki numara olan klasör sizin Mongo versiyonunuza göre değişiklik gösterebilir.

Açtığımız dosyada bindIp yazan satırı yorum haline getirip, yeni satıra bindIp olarak 0.0.0.0 yazacağız. Yani şöyle bir şey olacak.

```bash
# network interfaces
net:
    port: 27017
#  bindIp: 127.0.0.1
    bindIp: 0.0.0.0
```

Dosyayı kaydedip çıkış yapabiliriz. Sonra firewall’dan mongo portu için kural oluşturacağız.

### Firewall ayarı

* On the client operating system, go to Start > Run and type firewall.cpl. The Windows Firewall window opens.
* Click on the “Advanced Settings” link on the left pane. The Windows Firewall with Advanced security window opens.
* Click on the “Inbound Rules” option.
* On the left pane, click on “New rule”.
* Under “Rule Type” select the option “Port” and click next.
* Select “TCP”and “specific local ports” options.
* Key in the port number, the default port is TCP port 27017.
* Click Next.
* Select the option “Allow the connection”.
* Click Next, do not change any option here and click Next again.
* Specify a name for this rule.
* Click Finish.

### Mongo'da user oluşturup yetki verme

* Terminali açıp mongonun kurulu olduğu dizine gideceğiz. **C:\Program Files\MongoDB\Server\4.4\bin**
* **mongo** yazıp enter’a basarak mongo shell’e ulaşalım.
* hangi veritabanı için ayar yapacaksak **use veritabani_ismi** yazıp enterlayalım.
* sonrasında aşağıdaki satırı yazıp enter ile çalıştıralım.
```bash
db.createUser( { user: "adminName", pwd: "xxxxxx", roles: ["readWrite"] })
```
* En son Windows’un servisler panelinden Mongo’yu restart edelim.

İşlem bu kadar :)
