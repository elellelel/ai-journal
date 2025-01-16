import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import WritingCenter from "../../../app/javascript/components/WritingCenter.vue";
import TinyMCEEditor from "../../../app/javascript/components/TinyMCEEditor.vue";

describe("WritingCenter", () => {
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
  });

  afterEach(() => {
    // Clean up the mock CSRF token
    const meta = document.querySelector("meta[name='csrf-token']");
    if (meta) {
      meta.remove();
    }
  });

  it("renders the form with initial data", () => {
    const wrapper = mount(WritingCenter, {
      props: {
        existingEntries: [],
        initialEntryData: {
          title: "Initial Title",
          content: "Initial Content",
          generate_ai_response: true,
          linked_entry_ids: [],
        },
      },
    });

    // Check that the title field is prefilled
    expect(wrapper.find("#title").element.value).toBe("Initial Title");

    // Check that TinyMCEEditor is prefilled
    const editor = wrapper.findComponent(TinyMCEEditor);
    expect(editor.props("modelValue")).toBe("Initial Content");

    // Check that the AI response checkbox is checked
    expect(wrapper.find("#generateAIResponse").element.checked).toBe(true);
  });

  it("displays errors when submission fails", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ errors: ["Title can't be blank", "Content is too short"] }),
    });

    const wrapper = mount(WritingCenter, {
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
    expect(fetchMock).toHaveBeenCalledWith(`/users/${window.currentUser}/entries`, expect.objectContaining({
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
    }));
  });

  it("toggles all linked entry selections", async () => {
    const wrapper = mount(WritingCenter, {
      props: {
        existingEntries: [
          { id: 1, title: "Entry 1" },
          { id: 2, title: "Entry 2" },
        ],
      },
    });

    // Simulate checking the toggle all checkbox
    const toggleCheckbox = { target: { checked: true } };
    await wrapper.vm.toggleAllSelections(toggleCheckbox);

    // Check that all entry IDs are added to linked_entry_ids
    expect(wrapper.vm.formData.linked_entry_ids).toEqual([1, 2]);

    // Simulate unchecking the toggle all checkbox
    const untoggleCheckbox = { target: { checked: false } };
    await wrapper.vm.toggleAllSelections(untoggleCheckbox);

    // Check that linked_entry_ids is cleared
    expect(wrapper.vm.formData.linked_entry_ids).toEqual([]);
  });
});