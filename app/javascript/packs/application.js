import { createApp, reactive } from "vue";
import InteractiveChat from "../components/InteractiveChat.vue";
import EntriesTable from "../components/EntriesTable.vue";

const components = {
  InteractiveChat,
  EntriesTable,
};

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = window.currentUser; // Fetch the user ID from the global scope
  
  document.querySelectorAll("[data-component]").forEach((el) => {
    const componentName = el.getAttribute("data-component");
    const Component = components[componentName];

    if (Component) {
      const props = el.getAttribute("data-props");
      let parsedProps = {};
      try {
        parsedProps = props ? JSON.parse(props) : {};
      } catch (error) {
        console.error(`Failed to parse props for ${componentName}:`, error);
      }

      const reactiveProps = reactive(parsedProps);

      const app = createApp({
        components: components, // Explicitly register component
        template: `<EntriesTable v-model="entries" />`, // Use v-model binding
        setup() {
          return {
            entries: reactiveProps.entries || [],
          };
        },
      });

      app.mount(el);
    }
  });
});