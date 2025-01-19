import { createStore } from 'vuex';
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import WritingCenter from "../../../app/javascript/components/WritingCenter.vue";
import TinyMCEEditor from "../../../app/javascript/components/TinyMCEEditor.vue";
import EntriesTable from "../../../app/javascript/components/EntriesTable.vue";

describe("WritingCenter", () => {
  let store;
  let fetchMock;

  beforeEach(() => {
    // Mock the global fetch function
    fetchMock = vi.fn();
    global.fetch = fetchMock;

    // Mock the CSRF token in the document
    const meta = document.createElement("meta");
    meta.name = "csrf-token";
    meta.content = "test-csrf-token";
    document.head.appendChild(meta);

    // Mock window.currentUser
    global.window.currentUser = 1;

    store = createStore({
      state: {
        linkedEntryIds: [],
      },
      mutations: {
        SET_LINKED_ENTRY_IDS(state, ids) {
          state.linkedEntryIds = ids;
        },
      },
      actions: {
        updateLinkedEntryIds({ commit }, ids) {
          commit('SET_LINKED_ENTRY_IDS', ids);
        },
      },
      getters: {
        linkedEntryIds: (state) => state.linkedEntryIds,
      },
    });
  });

  afterEach(() => {
    // Clean up the mock CSRF token
    const meta = document.querySelector("meta[name='csrf-token']");
    if (meta) {
      meta.remove();
    }

    // Clean up global mocks
    delete global.window.currentUser;
  });

  it("displays errors when submission fails", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: () =>
        Promise.resolve({
          errors: ["Title can't be blank", "Content is too short"],
        }),
    });

    const wrapper = mount(WritingCenter, {
      global: {
        plugins: [store],
      },
      props: {
        existingEntries: [],
      },
    });

    // Submit the form
    await wrapper.find("form").trigger("submit.prevent");

    // Wait for DOM updates
    await wrapper.vm.$nextTick();

    // Check that errors are displayed
    expect(wrapper.find("#error_explanation").exists()).toBe(true);
    expect(wrapper.find("#error_explanation").text()).toContain("Title can't be blank");
    expect(wrapper.find("#error_explanation").text()).toContain("Content is too short");
  });

  it("submits the form successfully", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ entry: { id: 1 } }),
    });

    const wrapper = mount(WritingCenter, {
      global: {
        plugins: [store],
      },
      props: {
        existingEntries: [],
      },
    });

    // Fill out the form
    await wrapper.find("#title").setValue("New Title");
    const editor = wrapper.findComponent(TinyMCEEditor);
    await editor.vm.$emit("update:modelValue", "New Content");

    // Submit the form
    await wrapper.find("form").trigger("submit.prevent");

    // Check that fetch was called with the correct data
    expect(fetchMock).toHaveBeenCalledWith(
      "/users/1/entries",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "X-CSRF-Token": "test-csrf-token",
        }),
        body: JSON.stringify({
          entry: {
            title: "New Title",
            content: "New Content",
            generate_ai_response: false,
            linked_entry_ids: [],
          },
        }),
      })
    );
  });
});
