<script setup>
import { ref, watch, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import TinyMCEEditor from './TinyMCEEditor.vue';
import EntriesTable from './EntriesTable.vue';

// Vuex store
const store = useStore();
const linkedEntryIds = computed(() => store.state.linkedEntryIds);

// Local state
const message = ref('');
const showEntriesTable = ref(false); // State to control visibility of EntriesTable
const entries = ref([]);

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

// Watch for changes in Vuex linkedEntryIds and update formData
watch(linkedEntryIds, (newVal) => {
  formData.linked_entry_ids = newVal;
});


// Methods
const toggleEntriesTable = () => {
  showEntriesTable.value = !showEntriesTable.value; // Toggle visibility
};

const fetchEntries = async () => {
  try {
    const response = await fetch(`/users/${window.currentUser}/entries`);
    const data = await response.json();
    if (data.entries) {
      entries.value = data.entries; // Update entries for the child component
    }
  } catch (error) {
    console.error("Error fetching entries:", error);
  }
};

const submitForm = async () => {
  // Clear errors
  errors.value = [];

  try {
    let url;
    let method;
    
    if (props.initialEntryData.id) {
      url = `/users/${window.currentUser}/entries/${props.initialEntryData.id}`;
      method = 'PATCH';
    } else {
      method = 'POST';
      url = `/users/${window.currentUser}/entries`;
    }

    const response = await fetch(url, {
      method: method,
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
      // Redirect to the entry's page
      window.location.href = `/users/${window.currentUser}/entries/${entryId}`;
    } else {
      throw ['Failed to retrieve the entry details for redirection.'];
    }
  } catch (error) {
    errors.value = error;
  }
};

onMounted(async() => {
  console.log("Initial Entry:", props.initialEntryData);
});
</script>

<template>
  <div class="writing-center">
    <!-- Form for AI Submissions -->
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

      <!-- Submit Button -->
      <div class="mb-3">
        <button type="submit" class="btn btn-primary">Save Entry</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Optional styles */
</style>
