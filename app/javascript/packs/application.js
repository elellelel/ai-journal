import { createApp, reactive, h } from "vue";

import InteractiveChat from "../components/InteractiveChat.vue";
import EntriesTable from "../components/EntriesTable.vue";
import TinyMCEEditor from "../components/TinyMCEEditor.vue";
import WritingCenter from "../components/WritingCenter.vue";

const components = {
  InteractiveChat,
  EntriesTable,
  TinyMCEEditor,
  WritingCenter,
};

const sharedState = reactive({
  linkedEntryIds: []
});

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
          template: `<EntriesTable v-model="entries" :shared-state="sharedState"/>`, // Why won't :is=> work here?
          setup() {
            return {
              sharedState,
              entries: reactiveProps.entries || [],
            };
          },
        });
      } else {
        app = createApp({
          setup() {
            return {
              sharedState,
              props: reactive(parsedProps),
            };
          },
          render() {
            return h(Component, { ...this.props, sharedState });
          },
        });
      }

      app.mount(el);
    }
  });
};

document.addEventListener("turbo:load", initializeVueComponents); // For Turbo Drive
document.addEventListener("DOMContentLoaded", initializeVueComponents); // Fallback for full page loads