<template>
  <div>
    <h1>Vue Component Loaded</h1>
    <textarea v-model="entry" placeholder="Write something..."></textarea>
    <button @click="submitEntry">Submit</button>
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