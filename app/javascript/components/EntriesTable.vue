<template>
  <div>
    <!-- Select All Checkbox -->
    <div>
      <label>
        <input
          type="checkbox"
          :checked="allSelected"
          @change="toggleSelectAll"
        />
        Select All
      </label>
    </div>

    <!-- Entries Table -->
    <div
      class="entries-container"
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


<script>
import debounce from "lodash.debounce";

export default {
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
    sharedState: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      isLoading: false,
      currentPage: 1,
      hasMoreEntries: true,
      linkedEntryIds: [],
      allEntryIds: [], // Store all entry IDs
    };
  },
  computed: {
    entries: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
    allSelected() {
      // Check if all entries are selected
      return (
        this.allEntryIds.length > 0 &&
        this.linkedEntryIds.length === this.allEntryIds.length
      );
    },
  },
  watch: {
    linkedEntryIds(newVal) {
      this.sharedState.linkedEntryIds = newVal; // Sync with shared state
    },
  },
  methods: {
    async fetchEntries(page) {
      try {
        this.isLoading = true;

        const response = await fetch(`users/${window.currentUser}/entries?page=${page}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch entries: ${response.status}`);
        }

        const data = await response.json();

        if (data.entries && data.entries.length) {
          this.entries = [...this.entries, ...data.entries]; // Append new entries
          this.currentPage = page; // Update current page
        } else {
          this.hasMoreEntries = false; // No more entries to load
        }
      } catch (error) {
        console.error("Error fetching entries:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchAllEntryIds() {
      try {
        const response = await fetch(`users/${window.currentUser}/entry_ids`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch all entry IDs: ${response.status}`);
        }

        const data = await response.json();
        this.allEntryIds = data.entry_ids; // Store all entry IDs
      } catch (error) {
        console.error("Error fetching all entry IDs:", error);
      }
    },
    toggleSelectAll() {
      if (this.allSelected) {
        this.linkedEntryIds = []; // Deselect all
      } else {
        this.linkedEntryIds = [...this.allEntryIds]; // Select all
      }
    },
    handleScroll: debounce(function (event) {
      const container = event.target;

      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 5) {
        if (!this.isLoading && this.hasMoreEntries) {
          this.fetchEntries(this.currentPage + 1);
        }
      }
    }, 300),
  },
  async mounted() {
    await this.fetchEntries(this.currentPage); // Load initial entries
    await this.fetchAllEntryIds(); // Fetch all entry IDs
  },
};

</script>

