<script setup>
import { ref, watch } from 'vue';
import Editor from '@tinymce/tinymce-vue';

// Define props and emits
const props = defineProps({
  modelValue: String, // Prop for v-model binding
});

defineEmits(['update:modelValue']); // Emit for v-model updates

// Local state for the editor content
const content = ref(props.modelValue); // Initialize with modelValue

// Watch for changes in the content and emit updates
watch(content, (newValue) => {
  emit('update:modelValue', newValue); // Emit updates to the parent
});

// TinyMCE configuration
const tinyMceConfig = {
  plugins: 'fullscreen lists link image table code help wordcount',
  toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | fullscreen',
  menubar: 'file edit view insert format tools table help',
  height: 500,
};
</script>

<template>
  <Editor
    :init="tinyMceConfig"
    v-model="content"
    api-key="k2v84nlvkh8npo92qtm0bne99sm2jg4s8a2776jajajodn3w"
  />
</template>