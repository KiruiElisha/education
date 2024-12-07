<template>
  <div class="star-rating" role="slider" :aria-label="label" :aria-valuenow="modelValue * 5">
    <div class="stars-container" 
         @mouseleave="resetHoverState"
         ref="container">
      <div class="stars-background">
        <span v-for="i in maxStars" :key="`bg-${i}`" class="star">★</span>
      </div>
      
      <div class="stars-foreground" :style="{ width: `${ratingWidth}%` }">
        <span v-for="i in maxStars" :key="`fg-${i}`" class="star">★</span>
      </div>
      
      <!-- Interactive areas -->
      <div class="stars-interactive">
        <div v-for="i in maxStarsDouble" 
             :key="`hit-${i}`"
             class="hit-area"
             @mousemove="handleMouseMove($event, i)"
             @click="handleClick(i)"
             :title="`${i/2} stars`">
        </div>
      </div>
    </div>
    
    <!-- Rating display -->
    <div v-if="showValue" class="rating-value">
      {{ visualRating }}/{{ maxStars }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  maxStars: {
    type: Number,
    default: 5
  },
  allowHalf: {
    type: Boolean,
    default: true
  },
  precision: {
    type: Number,
    default: 2
  },
  showValue: {
    type: Boolean,
    default: true
  },
  label: {
    type: String,
    default: 'Rating'
  }
})

const emit = defineEmits(['update:modelValue'])

const container = ref(null)
const hoverRating = ref(null)
const selectedRating = ref(0)
const maxStarsDouble = computed(() => props.maxStars * 2)

// Computed width for the foreground stars (0-100%)
const ratingWidth = computed(() => {
  const rating = hoverRating.value ?? selectedRating.value
  return (rating / props.maxStars) * 100
})

// Visual rating display (0-5 scale)
const visualRating = computed(() => {
  return hoverRating.value?.toFixed(1) ?? selectedRating.value.toFixed(1)
})

function handleMouseMove(event, position) {
  if (!container.value) return
  
  const rect = container.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const width = rect.width
  const halfStarWidth = width / (props.maxStars * 2)
  
  // Calculate rating based on mouse position
  let rating = (position / 2)
  
  if (!props.allowHalf) {
    rating = Math.ceil(rating)
  }
  
  hoverRating.value = rating
}

function handleClick(position) {
  const rating = props.allowHalf ? position / 2 : Math.ceil(position / 2)
  selectedRating.value = rating
  const normalizedRating = rating / props.maxStars
  emit('update:modelValue', Number(normalizedRating.toFixed(props.precision)))
}

function resetHoverState() {
  hoverRating.value = null
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (newValue < 0) emit('update:modelValue', 0)
  if (newValue > 1) emit('update:modelValue', 1)
  selectedRating.value = newValue * props.maxStars
}, { immediate: true })
</script>

<style scoped>
.star-rating {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.stars-container {
  position: relative;
  display: inline-block;
  user-select: none;
  cursor: pointer;
}

.stars-background,
.stars-foreground {
  display: flex;
}

.stars-foreground {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  white-space: nowrap;
  color: #ffc107;
  transition: width 0.15s ease-in-out;
}

.stars-background {
  color: #e4e4e4;
}

.star {
  font-size: 1.5rem;
  padding: 0 0.125rem;
  transition: transform 0.1s ease-in-out;
}

.stars-interactive {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
}

.hit-area {
  flex: 1;
  height: 100%;
}

.hit-area:hover ~ .hit-area {
  background-color: rgba(0, 0, 0, 0.05);
}

.rating-value {
  font-size: 0.875rem;
  color: #666;
  min-width: 3rem;
}

/* Hover effect */
.stars-container:hover .star {
  transform: scale(1.05);
}

/* Active effect */
.stars-container:active .star {
  transform: scale(0.95);
}
</style>
