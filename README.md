Günün Notu / Mesajı (React Native & SQLite)

Bu proje, React Native (Expo) kullanılarak geliştirilmiş, mobil cihazın yerel hafızasında veri saklayan cross-platform bir **Günün Notu / Mesajı** uygulamasıdır. 

Veritabanı mimarisinde asenkron CRUD işlemlerini destekleyen modern SQLite yapısı kullanılmıştır.

Özellikler
Kalıcı Veri Depolama:Uygulama kapansa bile veriler SQLite (`expo-sqlite`) üzerinde güvenle saklanır.
Tam CRUD Desteği:Yeni not ekleme, dinamik listeleme, mevcut notu güncelleme ve silme işlemleri.
Modern UI/UX:`SafeAreaView` ve `FlatList` bileşenleri ile çentikli ekranlara uyumlu, performanslı ve minimalist tasarım.

Kullanılan Teknolojiler
React Native & Expo Go
SQLite (Asenkron Sürücülerle)
JavaScript (ES6+)

Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için:

1. Projeyi klonlayın:
   git clone [https://github.com/KULLANICI_ADIN/GununNotuApp.git](https://github.com/KULLANICI_ADIN/GununNotuApp.git)
Proje klasörüne gidin:
cd GununNotuApp
Gerekli paketleri yükleyin:
npm install
Uygulamayı emülatörde başlatın:
npx expo start
