import Vue from "vue";
import App from "./App.vue";


import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'


library.add(fas)
// Register the component globally
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;


Vue.mixin({
  methods: {
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array
    },
  },
})

// Vue.use(mixin)

new Vue({
  render: (h) => h(App),
}).$mount("#app");
