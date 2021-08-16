import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vant.js'
import 'lib-flexible'
import 'animate.css/animate.min.css'

Vue.config.productionTip = false

import 'swiper/css/swiper.min.css'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
