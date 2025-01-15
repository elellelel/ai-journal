<script setup>
import Editor from '@tinymce/tinymce-vue'
</script>

<template>
  <main id="sample">
    <Editor
      api-key="k2v84nlvkh8npo92qtm0bne99sm2jg4s8a2776jajajodn3w"
      :init="{
        plugins: 'fullscreen lists link image table code help wordcount',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | fullscreen', // Add fullscreen to the toolbar
        height: 500, // Set a default height
        menubar: 'file edit view insert format tools table help' // Include menu for better control
      }"
    />
  </main>
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
