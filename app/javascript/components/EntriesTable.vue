<template>
  <table class="table table-striped table-hover">
    <tbody>
      <tr v-for="entry in entries" :key="entry.id">
        <td>
          <a :href="entry.url" class="text-decoration-none">{{ entry.title }}</a>
        </td>
        <td>
          <a :href="entry.editUrl" class="btn btn-sm btn-warning">Edit</a>
          <button
            @click="deleteEntry(entry)"
            class="btn btn-sm btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    entries: {
      type: Array,
      required: true,
    },
  },
  methods: {
    deleteEntry(entry) {
      if (confirm("Are you sure?")) {
        fetch(entry.url, {
          method: "DELETE",
          headers: {
            "X-CSRF-Token": document.querySelector("[name='csrf-token']").content,
          },
        })
          .then((response) => {
            if (response.ok) {
              // Remove the entry from the table
              this.$emit("entry-deleted", entry.id);
            } else {
              alert("Failed to delete the entry.");
            }
          })
          .catch((error) => {
            console.error("Error deleting entry:", error);
          });
      }
    },
  },
};
</script>
