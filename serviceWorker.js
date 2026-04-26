const CACHE_NAME = 'network-first-v2'
const NETWORK_TIMEOUT_MS = 2000

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  )

  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  event.respondWith(networkFirst(event.request))
})

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)
  const networkPromise = fetch(request)

  try {
    const response = await promiseWithTimeout(networkPromise, NETWORK_TIMEOUT_MS)
    cache.put(request, response.clone())
    return response
  } catch {
    if (cachedResponse) return cachedResponse
    return networkPromise
  }
}

function promiseWithTimeout(promise, timeoutMs) {
  let timerId

  const timeoutPromise = new Promise((_, reject) => {
    timerId = setTimeout(() => {
      reject(new Error('Network timeout'))
    }, timeoutMs)
  })

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timerId)
  })
}
