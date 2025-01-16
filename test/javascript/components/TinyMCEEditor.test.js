import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { nextTick } from "vue";
import Editor from '@tinymce/tinymce-vue';
import TinyMCEEditor from '../../../app/javascript/components/TinyMCEEditor.vue';

describe('TinyMCEEditor', () => {
  it('renders the TinyMCE editor', () => {
    const wrapper = mount(TinyMCEEditor, {
      props: {
        modelValue: '<p>Initial content</p>',
      },
    });

    // Check if the TinyMCE Editor component is rendered
    const tinyMceEditor = wrapper.findComponent(Editor);
    expect(tinyMceEditor.exists()).toBe(true);
  });

  it('binds initial content from modelValue', () => {
    const initialContent = '<p>Initial content</p>';

    const wrapper = mount(TinyMCEEditor, {
      props: {
        modelValue: initialContent,
      },
    });

    // Check if the content prop initializes correctly
    const tinyMceEditor = wrapper.findComponent(Editor);
    expect(tinyMceEditor.props('modelValue')).toBe(initialContent);
  });

  it('updates modelValue when editor content changes', async () => {
    const wrapper = mount(TinyMCEEditor, {
      props: {
        modelValue: '<p>Initial content</p>',
      },
    });

    // Simulate user typing in the editor
    const tinyMceEditor = wrapper.findComponent(Editor);
    await tinyMceEditor.vm.$emit('update:modelValue', '<p>Updated content</p>');

    // Assert that the emitted event updates the parent value
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['<p>Updated content</p>']);
  });

  it('reacts to changes in the modelValue prop', async () => {
    const wrapper = mount(TinyMCEEditor, {
      props: {
        modelValue: '<p>Initial content</p>',
      },
    });

    // Update the modelValue prop
    await wrapper.setProps({ modelValue: '<p>New content</p>' });
    await nextTick();
    await wrapper.vm.$forceUpdate();

    // Check if the editor content reflects the updated prop
    const tinyMceEditor = wrapper.findComponent(Editor);
    expect(tinyMceEditor.props('modelValue')).toBe('<p>New content</p>');
  });

  it('applies TinyMCE configuration', () => {
    const wrapper = mount(TinyMCEEditor, {
      props: {
        modelValue: '',
      },
    });

    const tinyMceEditor = wrapper.findComponent(Editor);

    // Assert that the correct TinyMCE config is passed
    expect(tinyMceEditor.props('init')).toMatchObject({
      plugins: 'fullscreen lists link image table code help wordcount',
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | fullscreen',
      menubar: 'file edit view insert format tools table help',
      height: 500,
    });
  });
});
