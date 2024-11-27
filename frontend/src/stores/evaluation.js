import { defineStore } from 'pinia'
import { createResource } from 'frappe-ui'

export const evaluationStore = defineStore('education-evaluation', () => {
  const evaluation = createResource({
    url: 'education.education.api.get_student_evaluation',
    transform(data) {
      if (!data) return { labels: [], values: [], evaluations: [] }
      return {
        labels: data.labels || [],
        values: data.values || [],
        evaluations: data.evaluations || [],
        average: data.average || 0,
        metadata: data.metadata || {}
      }
    },
  })

  return {
    evaluation,
  }
}) 

