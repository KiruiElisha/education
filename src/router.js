import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/evaluation',
      name: 'Evaluation',
      component: () => import('./pages/Evaluation.vue')
    },
    {
      path: '/teacher-evaluation',
      name: 'TeacherEvaluation',
      component: () => import('./pages/TeacherEvaluation.vue')
    }
    // ... other routes
  ]
})

export default router 