<template>
  <div v-html="html"></div>
</template>

<script>
import abc from './abc.doc.md';
import Vue from 'vue';

let App;
export default App = {
  data() {
    return {
      html: ''
    }
  },
  created() {
    this.html = abc.main;
  },

  mounted() {
    this.update();
  },
  updated() {
    this.update();
  },

  methods: {
    update() {
      const docs = this.$el.querySelectorAll('vue-doc-md[doc-id]');
      const Base = this.$options._base;

      docs.forEach(el => {
        const docId = el.getAttribute('doc-id');
        const comp = abc.docs[docId];
        if (comp) {
          let pre = document.createElement('pre');
          let demo = document.createElement('div');
          pre.textContent = comp.src;
          el.appendChild(demo);
          el.appendChild(pre);

          const demoApp = new Base(comp.comp.default);
          demoApp.$mount(demo);
        }
      })
    },
  },
}

setTimeout(() => {
  new Vue(App).$mount('#app')
}, 0)
</script>