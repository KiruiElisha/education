<template>
  <div class="star-rating">
    <span
      v-for="star in stars"
      :key="star"
      :class="{'active': star <= Math.floor(currentRating)}"
      @click="setRating(star)"
      @mouseover="hoverRating(star)"
      @mouseleave="resetRating"
    >
      ★
      <span
        v-if="star === Math.ceil(currentRating) && currentRating % 1 !== 0"
        class="partial"
        :style="{ width: `${(currentRating % 1) * 100}%` }"
      >
        ★
      </span>
    </span>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Number,
  maxStars: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['update:modelValue'])

const currentRating = ref(props.modelValue)
const stars = Array.from({ length: props.maxStars }, (_, i) => i + 1)

function setRating(star) {
  currentRating.value = star
  emit('update:modelValue', star)
}

function hoverRating(star) {
  currentRating.value = star
}

function resetRating() {
  currentRating.value = props.modelValue
}

watch(() => props.modelValue, (newValue) => {
  currentRating.value = newValue
})
</script>

<style scoped>
.star-rating {
  display: flex;
  cursor: pointer;
  position: relative;
}

.star-rating span {
  font-size: 2rem;
  color: #d3d3d3;
  position: relative;
}

.star-rating span.active {
  color: #ffc107;
}

.star-rating span .partial {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  color: #ffc107;
  white-space: nowrap;
}
</style>
