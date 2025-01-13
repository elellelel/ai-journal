<template>
  <div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      entry: "",
    };
  },
  methods: {
    submitEntry() {
      alert("Entry submitted: " + this.entry);
    },
  },
};
</script>