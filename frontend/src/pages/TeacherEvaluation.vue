<template>
  <div class="p-8 max-w-4xl lg:max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
    <h1 class="text-4xl font-bold mb-10 text-center text-gray-800">Teacher Evaluation</h1>
    
    <CustomAlert v-if="showAlert" :message="alertMessage" :type="alertType" />

    <!-- Instructors Dropdown -->
    <div class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-700 mb-6">Select an Instructor</h2>
      <select v-model="selectedInstructor" @change="updateInstructor" class="block w-full p-3 bg-gray-100 rounded-md shadow-sm border border-gray-200">
        <option v-for="instructor in instructors" :key="instructor.instructor_name" :value="instructor" :disabled="instructor.reviewed">
          {{ instructor.instructor_name }} {{ instructor.reviewed ? '(Already Reviewed)' : '' }}
        </option>
      </select>
    </div>

    <!-- Evaluation Form -->
    <div v-if="selectedInstructor" class="mt-12 p-8 bg-gray-50 rounded-lg shadow-md border border-gray-200">
      <h2 class="text-2xl font-semibold text-gray-700 mb-6">Evaluate {{ selectedInstructor.instructor_name }}</h2>
      <form @submit.prevent="submitEvaluation" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label for="review_date" class="block text-sm font-medium text-gray-700">
              Review Date
            </label>
            <input
              type="date"
              id="review_date"
              v-model="evaluation.review_date"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <hr class="my-6 border-t border-gray-300">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="field in evaluationFields" :key="field.key" class="mb-4">
            <label :for="field.key" class="block text-sm font-medium text-gray-700">
              {{ field.label }}
            </label>
            <StarRating
              v-model="evaluation[field.key]"
              :max-stars="5"
              :allow-half="true"
            />
            <p v-if="field.description" class="mt-1 text-sm text-gray-500">
              {{ field.description }}
            </p>
          </div>
        </div>
        <div>
          <label for="feedback" class="block text-sm font-medium text-gray-700">
            Additional Feedback
          </label>
          <textarea
            id="feedback"
            v-model="evaluation.feedback"
            rows="4"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        <button type="submit" class="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300">
          Submit Evaluation
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { createResource } from 'frappe-ui'
import StarRating from '@/components/StarRating.vue'
import { studentStore } from '@/stores/student'
import CustomAlert from '@/components/CustomAlert.vue' // Import the custom alert

const evaluationFields = [
  { 
    key: 'respect', 
    label: 'Respect for Students',
    description: '1-Poor, 2-Fair, 3-Good, 4-Very Good, 5-Excellent'
  },
  { 
    key: 'exams', 
    label: 'Exams',
    description: '1-Very Difficult, 2-Difficult, 3-Moderate, 4-Fair, 5-Well Balanced'
  },
  { 
    key: 'communication_skill', 
    label: 'Communication Skill',
    description: '1-Poor, 2-Fair, 3-Good, 4-Very Good, 5-Excellent'
  },
  { 
    key: 'followup', 
    label: 'Student follow-up',
    description: '1-Never, 2-Rarely, 3-Sometimes, 4-Often, 5-Always'
  },
  { 
    key: 'homework', 
    label: 'Homework Load',
    description: '1-Too Little, 2-Light, 3-Balanced, 4-Heavy, 5-Too Much'
  },
  { 
    key: 'knowledge', 
    label: 'Knowledge of Subject Matter',
    description: '1-Limited, 2-Basic, 3-Good, 4-Very Good, 5-Excellent'
  },
]

const evaluation = reactive({
  student_group: '',
  instructors: '',
  review_date: new Date().toISOString().split('T')[0],
  respect: 0,
  exams: 0,
  communication_skill: 0,
  followup: 0,
  homework: 0,
  knowledge: 0,
  feedback: '',
  reviewer: '',
})

const instructors = reactive([])
const selectedInstructor = ref(null)
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref('success')
const reviewedTeachers = ref([])
const teacherReviews = ref({})

const studentGroupResource = createResource({
  url: 'education.education.api.get_student_group_details',
  method: 'GET',
})

const checkReviewResource = createResource({
  url: 'education.education.api.get_existing_teacher_reviews',
  method: 'GET',
})

const evaluationResource = createResource({
  url: 'education.education.api.submit_teacher_evaluation',
  method: 'POST',
})

async function fetchStudentGroupDetails() {
  try {
    const response = await studentGroupResource.fetch()
    evaluation.student_group = response.student_group_name
    
    const existingReviews = await checkReviewResource.fetch({
      student: evaluation.reviewer
    })
    
    reviewedTeachers.value = existingReviews.reviewed_teachers || []
    teacherReviews.value = existingReviews.review_details || []
    
    instructors.push(...response.instructors.map(instructor => ({
      ...instructor,
      reviewed: reviewedTeachers.value.includes(instructor.instructor_name),
      review_details: teacherReviews.value.find(r => r.instructors === instructor.instructor_name)
    })))
    
  } catch (error) {
    console.error('Error fetching student group details:', error)
    alertMessage.value = 'Error loading instructors. Please try again.'
    showAlert.value = true
  }
}

function updateInstructor() {
  if (selectedInstructor.value) {
    if (selectedInstructor.value.reviewed) {
      alertMessage.value = `You have already reviewed ${selectedInstructor.value.instructor_name} on ${selectedInstructor.value.review_details.review_date}`
      alertType.value = 'warning'
      showAlert.value = true
      selectedInstructor.value = null
      return
    }
    evaluation.instructors = selectedInstructor.value.instructor_name
  }
}

onMounted(() => {
  fetchStudentGroupDetails()
  const { studentInfo } = studentStore()
  evaluation.reviewer = studentInfo.value.name
})

async function submitEvaluation() {
  try {
    // Validate if instructor is selected
    if (!selectedInstructor.value) {
      alertMessage.value = 'Please select an instructor'
      showAlert.value = true
      return
    }

    // Double check if instructor has been reviewed
    const existingReviews = await checkReviewResource.fetch({
      student: evaluation.reviewer
    })
    
    const isAlreadyReviewed = existingReviews.reviewed_teachers.includes(selectedInstructor.value.instructor_name)
    
    if (isAlreadyReviewed) {
      alertMessage.value = 'You have already reviewed this instructor.'
      showAlert.value = true
      selectedInstructor.value = null
      return
    }

    console.log('Evaluation data before submission:', evaluation)

    const response = await evaluationResource.fetch({
      data: JSON.stringify(evaluation),
    })

    console.log('Evaluation submitted:', response)
    alertMessage.value = 'Evaluation submitted successfully!'
    showAlert.value = true

    // Update local state to reflect the new review
    const instructorIndex = instructors.findIndex(i => i.instructor_name === selectedInstructor.value.instructor_name)
    if (instructorIndex !== -1) {
      instructors[instructorIndex].reviewed = true
      instructors[instructorIndex].review_details = {
        review_date: evaluation.review_date
      }
    }

    // Reset form
    selectedInstructor.value = null
    evaluation.instructors = ''
    evaluation.review_date = new Date().toISOString().split('T')[0]
    evaluation.respect = 0
    evaluation.exams = 0
    evaluation.communication_skill = 0
    evaluation.followup = 0
    evaluation.homework = 0
    evaluation.knowledge = 0
    evaluation.feedback = ''
  } catch (error) {
    console.error('Error submitting evaluation:', error)
    // Handle specific error messages from the backend
    if (error.message?.includes('already submitted')) {
      alertMessage.value = 'You have already reviewed this instructor.'
      // Update local state to reflect the review status
      const instructorIndex = instructors.findIndex(i => i.instructor_name === selectedInstructor.value.instructor_name)
      if (instructorIndex !== -1) {
        instructors[instructorIndex].reviewed = true
      }
      selectedInstructor.value = null
    } else {
      alertMessage.value = 'Error submitting evaluation. Please try again.'
    }
    showAlert.value = true
  }
}
</script> 