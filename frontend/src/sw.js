// Service worker for PWA
self.addEventListener('fetch', (event) => {
  // Intercept navigation requests
  if (event.request.mode === 'navigate') {
    const url = new URL(event.request.url)
    
    // Handle login-related redirects
    if (url.pathname === '/login' || url.pathname === '/app' || url.pathname === '/home') {
      event.respondWith(
        fetch(event.request)
          .then(response => {
            // If response is a redirect or successful login
            if (response.redirected || response.ok) {
              return Response.redirect('/student-portal', 302)
            }
            return response
          })
          .catch(() => {
            return Response.redirect('/student-portal', 302)
          })
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
      clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        )
      })
    ])
  )
})

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data === 'login_successful') {
    // Notify all clients to redirect
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.navigate('/student-portal')
      })
    })
  }
}) 