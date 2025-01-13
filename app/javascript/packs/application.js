import { createApp } from "vue";
import JournalApp from "../components/JournalApp.vue";

document.addEventListener("DOMContentLoaded", () => {
  const appElement = document.getElementById("vue-app");
  if (appElement) {
    createApp(JournalApp).mount("#vue-app");
  }
});