import { createApp } from "vue";
import JournalApp from "../components/JournalApp.vue";

document.addEventListener("DOMContentLoaded", () => {
  const appElement = document.getElementById("vue-app");
  if (appElement) {
    console.log("Mounting Vue App...");
    createApp(JournalApp).mount("#vue-app");
    console.log("Vue App Mounted Successfully");
  } else {
    console.log("Vue App Mount Point Not Found");
  }
});