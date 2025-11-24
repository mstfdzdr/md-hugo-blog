---
title: "[Dotnet] Program.cs dosyasındakı DI'ları toparlamak"
subtitle: ""
date: 2025-11-24T23:47:35+03:00
lastmod: 2025-11-24T23:47:35+03:00
tags: [dependency injection, c sharp]
categories: [dotnet]
featuredImage: ""
featuredImagePreview: ""
draft: false
hiddenFromHomePage: false
toc:
    enable: true
    auto: false
code:
    copy: true
    maxShownLines: 50
---

Kod yazarken özellikle C# gibi bir OOP dil kullanınca her şey derli toplu olsun istiyorum. Çalıştığım projede Program.cs dosyasının Service katmanından eklenen Dependency Injection'larının epey kalabalık olması ve daha da eklenecek şeylerin olması sinirimi bozdu.

### Program.cs dosyası ne işe yarıyor?
.NET projelerinde Program.cs, uygulamanın başlangıç noktasıdır (entry point). Uygulamanın çalıştığında ilk olarak buradaki Main metodu veya WebApplication yapılandırması çalışır. Özetle;

- Uygulamanın giriş noktasını tanımlar
- DI Container (Dependency Injection) servislerini burada tanımlarsın
- Middleware pipeline burada oluşturulur
- Uygulama ayarlarını yükler (appsettings.json vs.)
- Web server (Kestrel) burada başlatılır

### Kötü vaziyet
```c#
builder.Services.AddScoped(typeof(IRepositoryAsync<>), typeof(RepositoryAsync<>));
builder.Services.AddScoped(typeof(IService<>), typeof(Service<>));

builder.Services.AddScoped<BilmemNeService>();
builder.Services.AddScoped<BilmemNeGenelService>();
builder.Services.AddScoped<BilmemNeMobilBildirimService>();

builder.Services.AddScoped<IDegisikServis, DegisikServis>();
builder.Services.AddScoped<IBaskaBirService, BaskaBirService>();
```

### Çözüm
Hal böyle olunca projede bir DependencyInjections klasörü açmak gerekti. İçine modül bazlı bir yapı kurdum.

``` c#
// file: DependencyInjections/BilmemNeDependencyInjection
    public static class BilmemNeDependencyInjection
    {
        public static IServiceCollection AddBilmemNeServices(this IServiceCollection services)
        {
			builder.Services.AddScoped<BilmemNeService>();
			builder.Services.AddScoped<BilmemNeGenelService>();
			builder.Services.AddScoped<BilmemNeMobilBildirimService>();
            return services;
        }
    }
```

Sonra Program.cs dosyasına gelip;

``` c#
builder.Services.AddScoped(typeof(IRepositoryAsync<>), typeof(RepositoryAsync<>));
builder.Services.AddScoped(typeof(IService<>), typeof(Service<>));

builder.Services.AddBilmemNeServices();
// diger modul haline getirdigim AddModulServices eklemeleri..
```

Valla dünya varmış :) 
