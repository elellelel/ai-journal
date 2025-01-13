import Vue from 'vue';
import JournalApp from '../components/JournalApp.vue';

document.addEventListener('DOMContentLoaded', () => {
  const appElement = document.getElementById('vue-app');
  if (appElement) {
    new Vue({
      render: (h) => h(HelloVue),
    }).$mount('#vue-app');
  }
});
