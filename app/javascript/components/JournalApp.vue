<template>
  <div>
    <h1>AI Journal</h1>
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

<style scoped>
textarea {
  width: 100%;
  margin-bottom: 10px;
}
button {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #2980b9;
}
</style>
