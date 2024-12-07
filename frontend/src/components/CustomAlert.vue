<template>
  <div v-if="visible" 
       class="fixed top-4 right-4 p-4 rounded shadow-lg" 
       :class="alertClass">
    {{ message }}
    <button @click="close" class="ml-4 text-white font-bold">X</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success'
  },
  duration: {
    type: Number,
    default: 3000,
  },
})

const visible = ref(true)

const alertClass = computed(() => {
  switch (props.type) {
    case 'error':
      return 'bg-red-500 text-white'
    case 'warning':
      return 'bg-yellow-500 text-white'
    case 'success':
    default:
      return 'bg-green-500 text-white'
  }
})

function close() {
  visible.value = false
}

setTimeout(close, props.duration)
</script>

<style scoped>
/* Add any additional styling here */
</style>
