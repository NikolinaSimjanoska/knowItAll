self.addEventListener('fetch', (event) => {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
  
          const responseToCache = response.clone();
  
          caches.open('my-cache')
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
  
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  });
  