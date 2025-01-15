import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import EntriesTable from '../../../app/javascript/components/EntriesTable.vue';

global.fetch = vi.fn((url) => {
  if (url.includes('/entries')) {
    return Promise.resolve({
      ok: true, // Ensure response.ok is true
      json: () => Promise.resolve({
        entries: [
          { id: 1, title: 'First Entry', url: '/entries/1' },
          { id: 2, title: 'Second Entry', url: '/entries/2' },
        ],
      }),
    });
  } else if (url.includes('/entry_ids')) {
    return Promise.resolve({
      ok: true, // Ensure response.ok is true
      json: () => Promise.resolve({ entry_ids: [1, 2] }),
    });
  }
  return Promise.reject(new Error('Unknown URL'));
});

describe('EntriesTable', () => {
  it('renders properly with required props', async () => {
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

    // Check if the component renders the correct number of entries
    expect(wrapper.findAll('tr').length).toBe(2); // 1 for header, 2 for data rows

    // Check if the titles are rendered
    expect(wrapper.text()).toContain('First Entry');
    expect(wrapper.text()).toContain('Second Entry');
  });
});
