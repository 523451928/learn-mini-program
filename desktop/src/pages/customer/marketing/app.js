/* eslint-disable */
import { loginAgain } from '@/assets/js/utils'
import Vue from 'vue'
import App from './app.vue'
import axios from 'axios'
import Element from 'element-ui'
import VueLazyload from 'vue-lazyload'
import 'element-ui/lib/theme-chalk/index.css'
import 'assets/css/index.scss'
import router from './router'
import store from '@/store/customer/marketing/store'
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('credentials')
axios.defaults.headers.common['Cache-Control'] = 'no-cache'
import { baseURL } from 'assets/js/utils'
axios.defaults.baseURL = baseURL
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('assets/imgs/loading.gif'),
  attempt: 1
})
Vue.use(Element)
Vue.config.productionTip = false
Vue.prototype.loginAgain = loginAgain
Vue.prototype.$http = axios
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})