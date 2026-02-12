
const CACHE_NAME = 'ya3m-cache-v2'; // تغيير الإصدار هنا يجبر المتصفح على التعرف على التحديث
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js'
];

// تثبيت الـ Service Worker وتحميل الملفات الأساسية
self.addEventListener('install', event => {
  self.skipWaiting(); // إجبار النسخة الجديدة على التفعيل فوراً
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// تفعيل النسخة الجديدة ومسح الكاش القديم
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // السيطرة على الصفحات المفتوحة فوراً
  );
});

// استراتيجية Network-First: حاول التحميل من الشبكة أولاً، وإذا فشلت (أوفلاين) استخدم الكاش
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // تحديث الكاش بالنسخة الجديدة المستلمة من الشبكة
        if (event.request.method === 'GET' && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // في حالة انقطاع الإنترنت، ابحث في الكاش
        return caches.match(event.request);
      })
  );
});
