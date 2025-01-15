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

function initializeVueComponents() {  
  document.querySelectorAll("[data-component]").forEach((el) => {
    const componentName = el.getAttribute("data-component");
    const Component = components[componentName];

    if (Component) {
      const reactiveProps = parseProps(el.getAttribute("data-props"));
      let app;

      switch (componentName) {
        case 'EntriesTable':
          app = createEntriesTable(reactiveProps);
          break;
        default:
          app = createDefaultComponent(Component, reactiveProps);
          break;
      }

      app.mount(el);
    }
  });
};

const sharedState = reactive({
  linkedEntryIds: []
});

function parseProps(props) {
  let parsedProps = {};
  try {
    parsedProps = props ? JSON.parse(props) : {};
  } catch (error) {
    console.error(`Failed to parse props for ${componentName}:`, error);
  }

  return reactive(parsedProps);
}

function createDefaultComponent(component, reactiveProps) {
  return createApp({
    setup() {
      return {
        sharedState,
        props: reactiveProps,
      };
    },
    render() {
      return h(component, { ...this.props, sharedState });
    },
  });
}

function createEntriesTable(reactiveProps) {
  return createApp({
    components: components, // Explicitly register component
    template: `<EntriesTable v-model="entries" :shared-state="sharedState"/>`, // Why won't :is=> work here?
    setup() {
      return {
        sharedState,
        entries: reactiveProps.entries || [],
      };
    },
  });
}

document.addEventListener("turbo:load", initializeVueComponents); // For Turbo Drive
document.addEventListener("DOMContentLoaded", initializeVueComponents); // Fallback for full page loads