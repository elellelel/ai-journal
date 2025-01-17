import Rails from "@rails/ujs";
Rails.start();

import { createApp, reactive, h } from "vue";

import InteractiveChat from "../components/InteractiveChat.vue";
import EntriesTable from "../components/EntriesTable.vue";
import WritingCenter from "../components/WritingCenter.vue";

import store from '../store';

const components = {
  InteractiveChat,
  EntriesTable,
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

      app.use(store);
      app.mount(el);
    }
  });
};

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
        props: reactiveProps,
      };
    },
    render() {
      return h(component, { ...this.props });
    },
  });
}

function createEntriesTable(reactiveProps) {
  return createApp({
    components: components, // Explicitly register component
    template: `<EntriesTable v-model="entries" />`, // Why won't :is=> work here?
    setup() {
      return {
        entries: reactiveProps.entries || [],
      };
    },
  });
}

document.addEventListener("turbo:load", initializeVueComponents); // For Turbo Drive
document.addEventListener("DOMContentLoaded", initializeVueComponents); // Fallback for full page loads