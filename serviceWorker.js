const cacheName = 'cache-first-v5'

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key !== cacheName) {
        return caches.delete(key)
      }
    }))
  }))
})

self.addEventListener('fetch', (event) => {
  let typesToCache = [
    'document',
    'font',
    'image',
    'manifest',
    'script',
    'style',
  ]

  if (!typesToCache.includes(event.request.destination)) return

  event.respondWith(caches.open(cacheName).then((cache) => {
    // Go to the cache first
    return cache.match(event.request.url).then((cachedResponse) => {
      // Return a cached response if we have one
      if (cachedResponse) {
        return cachedResponse
      }

      // Otherwise, hit the network
      return fetch(event.request).then((fetchedResponse) => {
        // Add the network response to the cache for later visits
        cache.put(event.request, fetchedResponse.clone())

        // Return the network response
        return fetchedResponse
      })
    })
  }))
})
