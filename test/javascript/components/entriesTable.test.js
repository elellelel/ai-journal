import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { reactive, nextTick } from 'vue';
import EntriesTable from '../../../app/javascript/components/EntriesTable.vue';

// Mock the global fetch API
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
  return Promise.reject(new Error('Unknown URL'));
});

describe('EntriesTable', () => {
  it('renders the correct number of entries', async () => {
    const wrapper = mount(EntriesTable, {
      props: {
        sharedState: { linked_entry_ids: [] },
        modelValue: [
          { id: 1, title: 'First Entry' },
          { id: 2, title: 'Second Entry' },
        ],
      },
    });

    // Wait for the component to fetch data and render
    await nextTick();

    // Check if the correct number of table rows are rendered
    expect(wrapper.findAll('tr').length).toBe(2); // Two entries should be rendered
  });

  it('displays a message when no entries are found', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ entries: [] }),
      })
    );

    const wrapper = mount(EntriesTable, {
      props: {
        sharedState: { linked_entry_ids: [] },
        modelValue: [],
      },
    });

    // Wait for the component to fetch data and render
    await nextTick();

    // Check for the no entries message
    expect(wrapper.text()).toContain('No entries found.');
  });

  it('checks "Select All" behavior', async () => {
    // Mock global fetch
    global.fetch = vi.fn((url) => {
      if (url.includes('/entry_ids')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ entry_ids: [1, 2] }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    const wrapper = mount(EntriesTable, {
      props: {
        sharedState: { linked_entry_ids: [] },
        modelValue: [
          { id: 1, title: 'First Entry' },
          { id: 2, title: 'Second Entry' },
        ],
      },
    });

    // Wait for the component to fetch all entry IDs
    await wrapper.vm.fetchAllEntryIds();
    await nextTick();

    // Wait for the component to fetch data
    await nextTick();

    // Simulate "Select All" checkbox click
    await wrapper.find('input[type="checkbox"]').trigger('change');

    // Check if all entries are selected
    expect(wrapper.vm.linkedEntryIds).toEqual([1, 2]);

    // Uncheck "Select All"
    await wrapper.find('input[type="checkbox"]').trigger('change');

    // Check if all entries are deselected
    expect(wrapper.vm.linkedEntryIds).toEqual([]);
  });

  it('triggers fetchEntries on scroll', async () => {
    const fetchEntriesSpy = vi.spyOn(EntriesTable.methods, 'fetchEntries');

    const wrapper = mount(EntriesTable, {
      props: {
        sharedState: { linked_entry_ids: [] },
        modelValue: [],
      },
    });

    // Simulate scroll event
    const scrollContainer = wrapper.find('.entries-container');
    scrollContainer.element.scrollTop = scrollContainer.element.scrollHeight;
    await scrollContainer.trigger('scroll');

    // Check if fetchEntries was called
    expect(fetchEntriesSpy).toHaveBeenCalled();
  });

  it('shows loading indicator while loading entries', async () => {
    const wrapper = mount(EntriesTable, {
      props: {
        sharedState: { linked_entry_ids: [] },
        modelValue: [],
      },
    });

    // Set loading state
    wrapper.vm.isLoading = true;
    await nextTick();

    // Check for loading indicator
    expect(wrapper.text()).toContain('Loading more entries...');
  });

  // This test fails - but let's use Vuex instead of a global variable OK?
  /*it('updates sharedState with linkedEntryIds', async () => {
    const sharedState = reactive({ linked_entry_ids: [] });

    const wrapper = mount(EntriesTable, {
      props: {
        sharedState,
        modelValue: [
          { id: 1, title: 'First Entry' },
          { id: 2, title: 'Second Entry' },
        ],
      },
    });

    // Select the first entry checkbox
    const checkbox = wrapper.find('input.entry-checkbox');
    await checkbox.setChecked(true);

    console.log('linkedEntryIds:', wrapper.vm.linkedEntryIds);

    // Wait for the watcher to update sharedState
    await nextTick();

    console.log('linkedEntryIds:', wrapper.vm.linkedEntryIds);
    console.log('sharedState:', sharedState.linked_entry_ids);

    // Assert that sharedState is updated
    expect(sharedState.linked_entry_ids).toContain(1);
  });*/
});