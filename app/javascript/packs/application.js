import { createApp } from "vue";
import JournalApp from "../components/JournalApp.vue";
import AnotherComponent from "../components/AnotherComponent.vue";

const components = {
  JournalApp,
  AnotherComponent,
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-component]").forEach((el) => {
    const componentName = el.getAttribute("data-component");
    const Component = components[componentName];
    if (Component) {
      createApp(Component).mount(el);
    }
  });
});