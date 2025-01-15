<script setup>
import { ref, reactive } from 'vue';
import TinyMCEEditor from './TinyMCEEditor.vue';

// Props
const props = defineProps({
  existingEntries: {
    type: Array,
    required: true,
  },
  initialEntryData: {
    type: Object,
    default: () => ({
      title: '',
      content: '',
      generate_ai_response: false,
      linked_entry_ids: [],
    }),
  },
});

// Reactive data
const formData = reactive({ ...props.initialEntryData });
const errors = ref([]);

// Methods
const submitForm = async () => {
  // Clear errors
  errors.value = [];

  try {
    const response = await fetch(`/users/${window.currentUser}/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // Explicitly set Accept header
        'X-CSRF-Token': document.querySelector("[name='csrf-token']").content,
      },
      body: JSON.stringify({ entry: formData }),
    });


    if (!response.ok) {
      const data = await response.json();
      throw data.errors || ['An unexpected error occurred.'];
    }

    const data = await response.json(); // Parse the response

    if (data.entry && data.entry.id) {
      const entryId = data.entry.id;
      // Redirect to the created entry's page
      window.location.href = `/users/${window.currentUser}/entries/${entryId}`;
    } else {
      throw ['Failed to retrieve the entry details for redirection.'];
    }
  } catch (error) {
    errors.value = error;
  }
};


const toggleAllSelections = (event) => {
  if (event.target.checked) {
    formData.linked_entry_ids = props.existingEntries.map((entry) => entry.id);
  } else {
    formData.linked_entry_ids = [];
  }
};
</script>

<template>
  <form @submit.prevent="submitForm">
    <!-- Error Messages -->
    <div v-if="errors.length" id="error_explanation" class="alert alert-danger">
      <h4>{{ errors.length }} error(s) prohibited this entry from being saved:</h4>
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <!-- Title Field -->
    <div class="mb-3">
      <label for="title" class="form-label">Title</label>
      <input
        v-model="formData.title"
        id="title"
        type="text"
        class="form-control"
        required
      />
    </div>

    <!-- TinyMCE Editor -->
    <TinyMCEEditor v-model="formData.content" />

    <!-- Generate AI Response -->
    <div class="mb-3">
      <div class="form-check">
        <input
          v-model="formData.generate_ai_response"
          type="checkbox"
          id="generateAIResponse"
          class="form-check-input"
        />
        <label class="form-check-label" for="generateAIResponse">
          Generate AI Response
        </label>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="mb-3">
      <button type="submit" class="btn btn-primary">Save Entry</button>
    </div>
  </form>
</template>

<style scoped>
/* Optional styles */
</style>
