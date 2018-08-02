/* eslint-disable */
import Vue from 'vue'
import App from './app.vue'
import axios from 'axios'
import VueLazyload from 'vue-lazyload'
import 'assets/css/index.scss'
import 'assets/css/tips.scss'
import 'assets/css/preview/font.scss'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from '@/store/customer/preview/store'
import Tips from '@/assets/js/vue-tips'
Vue.use(Tips)
import { getURLParameters } from '@/assets/js/utils'
let queryObj = getURLParameters()
if (queryObj.credentials) {
  localStorage.setItem('credentials', queryObj.credentials)
} 
let authorization = queryObj.credentials ? 'Bearer ' + queryObj.credentials : 'Bearer ' + localStorage.getItem('credentials')
axios.defaults.headers.common['Authorization'] = authorization
axios.defaults.headers.common['Cache-Control'] = 'no-cache'
import { baseURL, setFontSize } from 'assets/js/utils'
setFontSize(document, window)
axios.defaults.baseURL = baseURL

Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('assets/imgs/loading.gif'),
  attempt: 1
})
Vue.config.productionTip = false
Vue.prototype.$http = axios
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})