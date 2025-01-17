import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
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
  let actions;
  let store;

  beforeEach(() => {
    actions = {
      updateLinkedEntryIds: vi.fn(),
    };

    store = new Vuex.Store({
      state: {
        linkedEntryIds: [],
      },
      actions,
    });
  });

  it('renders the correct number of entries', async () => {
    const wrapper = mount(EntriesTable, {
      global: {
        plugins: [store],
      },
      props: {
        modelValue: [
          { id: 1, title: 'First Entry' },
          { id: 2, title: 'Second Entry' },
        ],
      },
    });

    // Wait for DOM updates
    await wrapper.vm.$nextTick();

    // Check if the correct number of table rows are rendered
    expect(wrapper.findAll('tr').length).toBe(2);
  });

  it('checks "Select All" behavior updates Vuex state', async () => {
    const wrapper = mount(EntriesTable, {
      global: {
        plugins: [store],
      },
      props: {
        modelValue: [
          { id: 1, title: 'First Entry', url: '/entries/1' },
          { id: 2, title: 'Second Entry', url: '/entries/2' },
        ],
      },
    });

    // Simulate "Select All" checkbox click
    const selectAllCheckbox = wrapper.find('input[type="checkbox"]');
    await selectAllCheckbox.setChecked(true);

    // Verify Vuex store state
    expect(store.state.linkedEntryIds).toEqual([1, 2]);

    // Uncheck "Select All"
    await selectAllCheckbox.setChecked(false);

    // Verify Vuex store state is cleared
    expect(store.state.linkedEntryIds).toEqual([]);
  });
});
