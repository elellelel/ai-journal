import { createApp, reactive } from "vue";
import InteractiveChat from "../components/InteractiveChat.vue";
import EntriesTable from "../components/EntriesTable.vue";

const components = {
  InteractiveChat,
  EntriesTable,
};

function initializeVueComponents() {  
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
      let app = {};

      if (componentName == 'EntriesTable') {
        app = createApp({
          components: components, // Explicitly register component
          template: `<EntriesTable v-model="entries" />`, // Use v-model binding
          setup() {
            return {
              entries: reactiveProps.entries || [],
            };
          },
        });
      } else {
        app = createApp(Component, reactiveProps)
      }

      app.mount(el);
    }
  });
};

document.addEventListener("turbo:load", initializeVueComponents); // For Turbo Drive
document.addEventListener("DOMContentLoaded", initializeVueComponents); // Fallback for full page loads