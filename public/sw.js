const CACHE_NAME = 'skillquarry-shell-v2'
const SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/brand/Favicon.png',
  '/brand/apple_touch_icon.png',
  '/brand/logo_mark.png',
  '/brand/primary_full_logo.png',
  '/brand/192_192PWA.png',
  '/brand/512_512PWA.png',
  '/brand/maskable_pwa_icon.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))))
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  if (request.method !== 'GET' || url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/rest/') || url.pathname.startsWith('/auth/')) return

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/index.html')))
    return
  }

  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.svg') || url.pathname.endsWith('.png')) {
    event.respondWith(caches.match(request).then((cached) => cached ?? fetch(request).then((response) => {
      const copy = response.clone()
      void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
      return response
    })))
  }
})
