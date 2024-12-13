import { computed, onMounted, ref, watch, onUnmounted, nextTick } from 'vue'
import { evaluationStore } from '@/stores/evaluation'
import { studentStore } from '@/stores/student'
import { Card } from 'frappe-ui'
// ... rest of your imports 