self.addEventListener('push', function(event) {
    if (event.data) {
      console.log('This push event has data: ', event.data.text());
    } else {
      console.log('This push event has no data.');
    }
  });
  
  self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');
  
    event.notification.close();
  
    event.waitUntil(
      clients.openWindow('https://developers.google.com/web/')
    );
  });