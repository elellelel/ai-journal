import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, createLocalVue } from '@vue/test-utils';
import { createStore } from 'vuex';
import { ref, nextTick } from 'vue';
import EntriesTable from '../../../app/javascript/components/EntriesTable.vue';

// Mock fetch API
global.fetch = vi.fn((url) => {
  if (url.includes('/entries?page=')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          entries: [
            { id: 1, title: 'First Entry', url: '/entries/1' },
            { id: 2, title: 'Second Entry', url: '/entries/2' },
          ],
        }),
    });
  } else if (url.includes('/entry_ids')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ entry_ids: [1, 2] }),
    });
  }
  return Promise.reject(new Error(`UNKNOWN URL: ${url}`));
});

describe('EntriesTable', () => {
  let store;

  beforeEach(() => {
   store = createStore({
      state: {
        linkedEntryIds: [], // Shared state for linked entries
      },
      mutations: {
        SET_LINKED_ENTRY_IDS(state, ids) {
          state.linkedEntryIds = ids;
        },
        REMOVE_ID_FROM_LINKED_ENTRY_IDS(state, id) {
          state.linkedEntryIds = state.linkedEntryIds.filter(entryId => entryId !== id);
        },
        ADD_ID_TO_LINKED_ENTRY_IDS(state, id) {
          state.linkedEntryIds = [...state.linkedEntryIds, id];
        }
      },
      actions: {
        updateLinkedEntryIds({ commit }, ids) {
          commit('SET_LINKED_ENTRY_IDS', ids);
        },
        removeIdFromLinkedEntryIds({ commit }, id) {
          commit('REMOVE_ID_FROM_LINKED_ENTRY_IDS', id);
        },
        addIdToLinkedEntryIds({ commit }, id) {
          commit('ADD_ID_TO_LINKED_ENTRY_IDS', id);
        }
      },
      getters: {
        linkedEntryIds: (state) => state.linkedEntryIds,
      },
    });
  });

  /*it("renders the entries correctly", () => {
    const wrapper = mount(EntriesTable, {
      global: {
        plugins: [store],
      },
      props: {
        modelValue: [
          { id: 1, title: "Entry 1", url: "/entries/1" },
          { id: 2, title: "Entry 2", url: "/entries/2" },
        ],
      },
    });

    expect(wrapper.findAll(".entry-checkbox").length).toBe(2);
    expect(wrapper.text()).toContain("Entry 1");
    expect(wrapper.text()).toContain("Entry 2");
  });*/

  it('toggles select-all correctly', async () => {
    //const updateLinkedEntryIdsSpy = vi.spyOn(store, 'dispatch');

    const wrapper = mount(EntriesTable, {
      global: {
        plugins: [store],
      },
      props: {
        modelValue: [],
      },
    });

    // Mock entries and allEntryIds
    wrapper.vm.entries = [
      { id: 1, title: 'Entry 1', url: '/entry/1' },
      { id: 2, title: 'Entry 2', url: '/entry/2' },
    ];
    wrapper.vm.allEntryIds.value = ref([1, 2]);

    await nextTick();

    // Select All

    const checkbox = wrapper.find('#selectAll');
    console.log('Checkbox found:', checkbox.exists());
    expect(checkbox.exists()).toBe(true);

    checkbox.element.checked = true;
    await checkbox.trigger('change');
    await nextTick();

    //expect(updateLinkedEntryIdsSpy).toHaveBeenCalledWith('updateLinkedEntryIds', [1, 2]);

    // await wrapper.find('#selectAll').setChecked(true);
    /*expect(store.state.linkedEntryIds).toEqual([1, 2]);

    // Deselect All
    await wrapper.find('#selectAll').setChecked(false);
    expect(store.state.linkedEntryIds).toEqual([]);*/
  });

  /*it("updates individual linked entry ID correctly", async () => {
    const wrapper = mount(EntriesTable, {
      global: {
        plugins: [store],
      },
      props: {
        modelValue: [
          { id: 1, title: "Entry 1", url: "/entries/1" },
          { id: 2, title: "Entry 2", url: "/entries/2" },
        ],
      },
    });

    // Select an entry
    await wrapper.findAll(".entry-checkbox")[0].setValue(true);
    expect(store.state.linkedEntryIds).toEqual([1]);

    // Deselect the same entry
    await wrapper.findAll(".entry-checkbox")[0].setValue(false);
    expect(store.state.linkedEntryIds).toEqual([]);
  });


    it("shows loading indicator when loading", async () => {
    const wrapper = mount(EntriesTable, {
      global: {
        plugins: [store],
      },
      props: {
        modelValue: [],
      },
    });

    await wrapper.setData({ isLoading: true });
    expect(wrapper.find(".loading-indicator").exists()).toBe(true);
    expect(wrapper.text()).toContain("Loading more entries...");
  });

  it("handles scrolling and fetches more entries", async () => {
    const wrapper = mount(EntriesTable, {
      global: {
        plugins: [store],
      },
      props: {
        modelValue: [],
      },
    });

    // Mock initial entries and simulate a response for fetchEntries
    wrapper.vm.entries = [
      { id: 1, title: "Entry 1", url: "/entry/1" },
      { id: 2, title: "Entry 2", url: "/entry/2" },
    ];
    wrapper.vm.hasMoreEntries.value = true; // Allow loading more entries

    // Simulate user scrolling near the bottom
    const container = wrapper.find(".entries-container");
    container.element.scrollHeight = 500;
    container.element.scrollTop = 450; // Near the bottom
    container.element.clientHeight = 50;

    // Trigger the scroll event
    await container.trigger("scroll");

    // Wait for potential asynchronous changes
    await nextTick();

    // Verify that entries have been updated after scrolling
    expect(wrapper.vm.entries.length).toBeGreaterThan(2); // Ensure new entries are added
  });


  it("displays a message when no entries are found", () => {
    const wrapper = mount(EntriesTable, {
      global: {
        plugins: [store],
      },
      props: {
        modelValue: [],
      },
    });

    expect(wrapper.text()).toContain("No entries found.");
  });*/
});