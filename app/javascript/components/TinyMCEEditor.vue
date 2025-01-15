<script setup>
import Editor from '@tinymce/tinymce-vue'

// Initialize the TinyMCE configuration
const initConfig = {
  plugins: 'fullscreen lists link image table code help wordcount',
  toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | fullscreen',
  height: 500,
  menubar: 'file edit view insert format tools table help',
}
</script>

<template>
  <div>
    <Editor
      api-key="k2v84nlvkh8npo92qtm0bne99sm2jg4s8a2776jajajodn3w"
      :init="initConfig"
    />
  </div>
</template>

<style scoped>
.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  #sample {
    display: flex;
    flex-direction: column;
    place-items: center;
    width: 1000px;
  }
}
</style>
