import './index.css'

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import { createPinia } from 'pinia'
// import '../polyfills'

import {
  Button,
  Card,
  Input,
  setConfig,
  frappeRequest,
  resourcesPlugin,
} from 'frappe-ui'

import { VFrappeChart } from 'vue-frappe-chart'

// Register service worker with periodic sync
if ('serviceWorker' in navigator && 'periodicSync' in navigator.serviceWorker) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        '/assets/education/frontend/sw.js',
        { scope: '/student-portal/' }
      )

      // Request periodic sync permission
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync',
      })

      if (status.state === 'granted') {
        try {
          await registration.periodicSync.register('sync-data', {
            minInterval: 24 * 60 * 60 * 1000, // 24 hours
          })
        } catch (error) {
          console.error('Periodic sync registration failed:', error)
        }
      }

      // Request notification permission
      if ('Notification' in window) {
        Notification.requestPermission()
      }
    } catch (error) {
      console.error('Service worker registration failed:', error)
    }
  })
}

// create a pinia instance
let pinia = createPinia()

let app = createApp(App)

setConfig('resourceFetcher', frappeRequest)

app.use(pinia)
app.use(router)
app.use(resourcesPlugin)

app.component('Button', Button)
app.component('Card', Card)
app.component('Input', Input)
app.component('VFrappeChart', VFrappeChart)

router.isReady().then(() => {
  app.mount('#app')
})


