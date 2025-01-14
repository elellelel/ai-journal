<template>
  <div>
    <div
      class="entries-container"
      @scroll.prevent="handleScroll"
      style="height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 10px;"
    >
      <table class="table table-striped table-hover" v-if="entries.length">
        <tbody>
          <tr v-for="entry in entries" :key="entry.id">
            <td>
              <a :href="entry.url" class="text-decoration-none">{{ entry.title }}</a>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else>No entries found.</div>
    </div>
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
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      isLoading: false,
      currentPage: 1, // Tracks the current page for pagination
      hasMoreEntries: true, // Indicates if there are more entries to load
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
  },
  methods: {
    async fetchEntries(page) {
      try {
        this.isLoading = true;

        const response = await fetch(`users/${window.currentUser}/entries?page=${page}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json", // Ensure JSON response
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
    handleScroll: debounce(function (event) {
      const container = event.target;

      // Check if user has scrolled to the bottom of the container
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 5) {
        if (!this.isLoading && this.hasMoreEntries) {
          this.fetchEntries(this.currentPage + 1); // Request the next page
        }
      }
    }, 300), // Debounce the scroll handler to optimize performance
  },
  mounted() {
    // Initial load
    this.fetchEntries(this.currentPage);
  },
};
</script>

