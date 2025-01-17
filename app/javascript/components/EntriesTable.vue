<template>
  <div>
    <!-- Select All Checkbox -->
    <div class="container">
      <div class="row">
        <label>
          <input
            id="selectAll"
            type="checkbox"
            :checked="allSelected"
            @change="toggleSelectAll"
          />
          Select All
        </label>
      </div>
    </div>

    <!-- Entries Table -->
    <div
      class="container entries-container"
      @scroll.prevent="handleScroll"
      style="height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 10px;"
    >
      <table class="table table-striped table-hover" v-if="entries.length">
        <tbody>
          <tr v-for="entry in entries" :key="entry.id">
            <td>
              <input
                type="checkbox"
                :value="entry.id"
                class="entry-checkbox"
                v-model="linkedEntryIds"
              />
            </td>
            <td>
              <a :href="entry.url" class="text-decoration-none">{{ entry.title }}</a>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else>No entries found.</div>
    </div>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading-indicator">
      <p>Loading more entries...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import debounce from 'lodash.debounce';
import { useStore } from 'vuex';

// Props
const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

// Emits
const emit = defineEmits(['update:modelValue']);

// Vuex Store
const store = useStore();
const linkedEntryIds = computed(() => store.state.linkedEntryIds);

// Local State
const isLoading = ref(false);
const currentPage = ref(1);
const hasMoreEntries = ref(true);
const allEntryIds = ref([]);

// Entries (computed from modelValue)
const entries = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Computed Properties
const allSelected = computed(() => {
  return (
    Array.isArray(allEntryIds.value) &&
    Array.isArray(linkedEntryIds.value) &&
    allEntryIds.value.length > 0 &&
    linkedEntryIds.value.length === allEntryIds.value.length
  );
});

// Methods
const fetchEntries = async (page) => {
  try {
    isLoading.value = true;
    const url = `/users/${window.currentUser}/entries?page=${page}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch entries: ${response.status}`);
    }

    const data = await response.json();

    if (data.entries && data.entries.length) {
      entries.value = [...entries.value, ...data.entries]; // Append new entries
      currentPage.value = page; // Update current page
    } else {
      hasMoreEntries.value = false; // No more entries to load
    }
  } catch (error) {
    console.error('Error fetching entries:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchAllEntryIds = async () => {
  try {
    const url = `/users/${window.currentUser}/entry_ids`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch all entry IDs: ${response.status}`);
    }

    const data = await response.json();
    allEntryIds.value = data.entry_ids;

  } catch (error) {
    console.error('Error fetching all entry IDs:', error);
  }
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    store.dispatch('updateLinkedEntryIds', []);
  } else {
    store.dispatch('updateLinkedEntryIds', [...allEntryIds.value]);
  }
};

const handleScroll = debounce((event) => {
  const container = event.target;

  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 5) {
    if (!isLoading.value && hasMoreEntries.value) {
      fetchEntries(currentPage.value + 1);
    }
  }
}, 300);

// Lifecycle Hook
onMounted(async () => {
  entries.value = [];
  await fetchEntries(currentPage.value); // Load initial entries
  await fetchAllEntryIds(); // Fetch all entry IDs
});
</script>