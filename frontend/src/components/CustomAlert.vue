<template>
  <div v-if="visible" class="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
    {{ message }}
    <button @click="close" class="ml-4 text-white font-bold">X</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  message: String,
  duration: {
    type: Number,
    default: 3000,
  },
})

const visible = ref(true)

function close() {
  visible.value = false
}

setTimeout(close, props.duration)
</script>

<style scoped>
/* Add any additional styling here */
</style>
