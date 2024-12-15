// Service worker for PWA
self.addEventListener('fetch', (event) => {
  // Intercept navigation requests
  if (event.request.mode === 'navigate') {
    const url = new URL(event.request.url)
    
    // If trying to access /app or /home, redirect to student portal
    if (url.pathname.startsWith('/app') || url.pathname.startsWith('/home')) {
      event.respondWith(
        Response.redirect('/student-portal', 302)
      )
      return
    }
  }
})

// Handle installation
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

// Handle activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Take control of all clients
      clients.claim(),
      // Clear old caches if any
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName)
          })
        )
      })
    ])
  )
})

// Handle offline fallback
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If offline and trying to navigate, redirect to student portal
          return Response.redirect('/student-portal', 302)
        })
    )
  }
}) 