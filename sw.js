var CACHE_NAME = 'pomodoro';
var urlsToCache = [
    'base.css',
    'main.js'
];

// インストール処理
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches
            .match(event.request)
            .then(function (response) {
                return response || fetch(event.request);
            })
    );
});

// // 通知を受け取ったときの処理
// self.addEventListener('notificationclick', function (event) {
//     console.log('Notification clicked!');
//     event.notification.close();

//     // 通知をクリックした時の挙動を指定
//     clients.openWindow('https://example.com');
// });

// // 通知を表示する処理
// function displayNotification() {
//     if (Notification.permission === 'granted') {
//         self.registration.showNotification('ポモドーロタイマー', {
//             body: '休憩時間です！',
//             icon: 'path/to/icon.png'
//         });
//     }
// }