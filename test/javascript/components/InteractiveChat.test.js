import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createStore } from "vuex";
import InteractiveChat from "../../../app/javascript/components/InteractiveChat.vue";

const store = createStore({
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
      commit("SET_LINKED_ENTRY_IDS", ids);
    },
  },
  getters: {
    linkedEntryIds: (state) => state.linkedEntryIds,
  },
});

describe("InteractiveChat", () => {
  beforeEach(() => {
    store.dispatch("updateLinkedEntryIds", []); // Reset store state before each test
  });

  it("renders the chat box and input field", () => {
    const wrapper = mount(InteractiveChat, {
      global: {
        plugins: [store],
      },
    });

    // Check for chat box
    expect(wrapper.find("#chat-box").exists()).toBe(true);

    // Check for input field
    expect(wrapper.find("input[type='text']").exists()).toBe(true);
  });

  it("sends a user message and updates the messages array", async () => {
    vi.useFakeTimers();

    const wrapper = mount(InteractiveChat, {
      global: {
        plugins: [store],
      },
    });

    const input = wrapper.find("input[type='text']");
    const form = wrapper.find("form");

    // Mock fetch response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "AI response" }),
      })
    );

    // Simulate user input and form submission
    await input.setValue("Hello AI");
    await form.trigger("submit");

    // Assert that user's message is added
    expect(wrapper.vm.messages).toContainEqual({ type: "user", content: "Hello AI" });

    // Wait for the fetch to resolve
    await vi.runAllTimers();

    // Assert that AI's response is added
    expect(wrapper.vm.messages).toContainEqual({ type: "ai", content: "AI response" });

    vi.useRealTimers();
  });

  it("does not send an empty message", async () => {
    const wrapper = mount(InteractiveChat, {
      global: {
        plugins: [store],
      },
    });

    const form = wrapper.find("form");

    // Mock fetch
    global.fetch = vi.fn();

    // Simulate empty form submission
    await form.trigger("submit");

    // Assert fetch is not called
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("scrolls to the bottom when a new message is added", async () => {
    const wrapper = mount(InteractiveChat, {
      global: {
        plugins: [store],
      },
    });

    // Add a new message
    wrapper.vm.messages.push({ type: "user", content: "Test message" });

    // Wait for reactivity updates
    await nextTick();

    // Check the chat box scroll position directly
    const chatBox = wrapper.find("#chat-box").element;
    expect(chatBox.scrollTop).toBe(chatBox.scrollHeight);
  });

  it("renders user and AI messages correctly", async () => {
    const wrapper = mount(InteractiveChat, {
      global: {
        plugins: [store],
      },
    });

    // Add messages
    wrapper.vm.messages = [
      { type: "user", content: "Hello AI" },
      { type: "ai", content: "Hello User" },
    ];

    // Wait for DOM updates
    await nextTick();
    await wrapper.vm.$forceUpdate();

    // Check rendered content
    const chatBox = wrapper.find("#chat-box").text();

    expect(chatBox).toContain("You: Hello AI");
    expect(chatBox).toContain("AI: Hello User");
  });
});
