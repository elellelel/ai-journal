<script setup>
import Editor from '@tinymce/tinymce-vue'
</script>

<template>
  <main id="sample">
    <Editor
      api-key="k2v84nlvkh8npo92qtm0bne99sm2jg4s8a2776jajajodn3w"
      :init="{
        plugins: 'lists link image table code help wordcount'
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