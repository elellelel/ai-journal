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
            @change.prevent="toggleSelectAll"
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
                :checked="!!linkedEntries[entry.id]"
                @change.prevent="updateIndividualLinkedEntryId"
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
const linkedEntries = computed(() => store.state.linkedEntries);

const removeEntryFromLinkedEntries = (id) => {
  store.dispatch('removeEntryFromLinkedEntries', id);
}

const addEntryToLinkedEntries = (entry) => {
  store.dispatch('addEntryToLinkedEntries', entry);
}

// Local State
const isLoading = ref(false);
const currentPage = ref(1);
const hasMoreEntries = ref(true);
const allEntries = ref([]);

// Entries (computed from modelValue)
const entries = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Computed Properties
const allSelected = computed(() => {
  return (
    Object.keys(linkedEntries.value).length === allEntries.value.length
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

const fetchAllEntries = async () => {
  try {
    const url = `/users/${window.currentUser}/entries`;

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
    allEntries.value = data.entries;

  } catch (error) {
    console.error('Error fetching all entries:', error);
  }
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    store.dispatch('updateLinkedEntries', []);
  } else {
    store.dispatch('updateLinkedEntries', [...allEntries.value]);
  }
};

const updateIndividualLinkedEntryId = (event) => {
  const entryId = parseInt(event.target.value, 10);
  if (store.state.linkedEntries[entryId]) {
    store.dispatch('removeEntryFromLinkedEntries', entryId);
  } else {
    const entry = allEntries.value.find((e) => e.id === entryId);
    if (entry) {
      store.dispatch('addEntryToLinkedEntries', entry);
    }
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
  await fetchAllEntries(); // Fetch all entry IDs
});
</script>