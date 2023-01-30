# Python: Ayın Son Gününü Bulmak

Bir iş için girilen bir ayın son gününü bulmam gerekti. Kendime not olsun diye buraya da ekleyeyim istedim.
<!--more-->

Pythonda bunu calendar.monthrange ile kolayca döndürebiliyoruz. {{< link href="https://docs.python.org/3/library/calendar.html#calendar.monthrange" content=Dökümantasyona >}} göre bu method belirtilen yıl ve ay için ayın ilk
gününün hafta içi gününü ve aydaki gün sayısını döndürüyor. O yüzden şu şekilde istediğimiz ayın son gününe ulaşmak mümkün.

```Python
import calendar
ayinSonGunu = calendar.monthrange(2022,4)[1]
print(ayinSonGunu)
```


