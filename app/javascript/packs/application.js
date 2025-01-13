import { createApp } from "vue";
import InteractiveChat from "../components/InteractiveChat.vue";
import EntriesTable from "../components/EntriesTable.vue";

const components = {
  InteractiveChat,
  EntriesTable,
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-component]").forEach((el) => {
    const componentName = el.getAttribute("data-component");
    const Component = components[componentName];

    if (Component) {
      const props = el.getAttribute("data-props");
      let parsedProps = [];
      try {
        parsedProps = props ? JSON.parse(props) : [];
      } catch (error) {
        console.error("Failed to parse data-props:", error);
      }

      const app = createApp(Component, props ? JSON.parse(props) : {});

      if (componentName === "EntriesTable") {
        app.config.globalProperties.$on = (event, callback) => {
          if (event === "entry-deleted") {
            const deletedId = callback.id;
            const entries = JSON.parse(props);
            el.setAttribute(
              "data-props",
              JSON.stringify(entries.filter((entry) => entry.id !== deletedId))
            );
          }
        };
      }

      app.mount(el);
    }
  });
});
