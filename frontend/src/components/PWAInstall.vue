<template>
  <div v-if="showInstallPrompt" class="fixed bottom-4 right-4">
    <Button
      variant="solid"
      @click="installPWA"
      class="flex items-center gap-2"
    >
      <span>Install App</span>
      <DownloadIcon class="w-4 h-4" />
    </Button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { DownloadIcon } from 'lucide-vue-next'
import { Button } from 'frappe-ui'

const deferredPrompt = ref(null)
const showInstallPrompt = ref(false)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    showInstallPrompt.value = true
  })
})

const installPWA = async () => {
  if (!deferredPrompt.value) return
  
  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice
  
  if (outcome === 'accepted') {
    console.log('PWA installed successfully')
  }
  
  deferredPrompt.value = null
  showInstallPrompt.value = false
}
</script> 