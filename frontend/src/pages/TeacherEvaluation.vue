<template>
  <div class="p-8 max-w-4xl lg:max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
    <h1 class="text-4xl font-bold mb-10 text-center text-gray-800">Teacher Evaluation</h1>
    
    <CustomAlert v-if="showAlert" :message="alertMessage" />

    <!-- Instructors Dropdown -->
    <div class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-700 mb-6">Select an Instructor</h2>
      <select v-model="selectedInstructor" @change="updateInstructor" class="block w-full p-3 bg-gray-100 rounded-md shadow-sm border border-gray-200">
        <option v-for="instructor in instructors" :key="instructor.name" :value="instructor">
          {{ instructor.instructor_name }}
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
            />
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
  { key: 'respect', label: 'Respect for Students' },
  { key: 'exams', label: 'Exams' },
  { key: 'communication_skill', label: 'Communication Skill' },
  { key: 'followup', label: 'Student follow-up' },
  { key: 'homework', label: 'Homework Load' },
  { key: 'knowledge', label: 'Knowledge of Subject Matter' },
]

const evaluation = reactive({
  student_group: '',
  instructors: '',
  review_date: new Date().toISOString().split('T')[0],
  respect: 0,
  exams: 0.6,
  communication_skill: 0,
  followup: 0.7,
  homework: 0,
  knowledge: 0,
  feedback: '',
  reviewer: '',
})

const instructors = reactive([])
const selectedInstructor = ref(null)
const showAlert = ref(false)
const alertMessage = ref('')

const studentGroupResource = createResource({
  url: 'education.education.api.get_student_group_details',
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
    instructors.push(...response.instructors)
  } catch (error) {
    console.error('Error fetching student group details:', error)
  }
}

function updateInstructor() {
  if (selectedInstructor.value) {
    evaluation.instructors = selectedInstructor.value.instructor_name;
  }
}

onMounted(() => {
  fetchStudentGroupDetails()
  const { studentInfo } = studentStore()
  evaluation.reviewer = studentInfo.value.name
})

async function submitEvaluation() {
  try {
    console.log('Evaluation data before submission:', evaluation);

    const response = await evaluationResource.fetch({
      data: JSON.stringify(evaluation),
    });

    console.log('Evaluation submitted:', response);
    alertMessage.value = 'Evaluation submitted successfully!'
    showAlert.value = true

    // Reset form
    selectedInstructor.value = null;
    evaluation.instructors = '';
    evaluation.review_date = new Date().toISOString().split('T')[0];
    evaluation.respect = 0;
    evaluation.exams = 0.6;
    evaluation.communication_skill = 0;
    evaluation.followup = 0.7;
    evaluation.homework = 0;
    evaluation.knowledge = 0;
    evaluation.feedback = '';
  } catch (error) {
    console.error('Error submitting evaluation:', error);
    alertMessage.value = 'Error submitting evaluation. Please try again.'
    showAlert.value = true
  }
}
</script> 