/* eslint-disable */
import { loginAgain } from '@/assets/js/utils'
import Vue from 'vue'
import App from './app.vue'
import axios from 'axios'
import Element from 'element-ui'
import VueLazyload from 'vue-lazyload'
import draggable from 'vuedraggable'
import 'element-ui/lib/theme-chalk/index.css'
import 'assets/css/index.scss'
import router from './router'
import store from '@/store/customer/product/store'
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('credentials')
axios.defaults.headers.common['Cache-Control'] = 'no-cache'
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          break;
        case 500:
          vue.$message.error('服务器异常')
          break;
        case 502:
        case 503:
          vue.$message.error('服务器繁忙，请稍后重试')
          break;
      }
    }
    return Promise.reject(error)
  }
)
Vue.prototype.loginAgain = loginAgain
import { baseURL } from 'assets/js/utils'
axios.defaults.baseURL = baseURL
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('assets/imgs/loading.gif'),
  attempt: 1
})
Vue.component('draggable', draggable)
Vue.use(Element)
Vue.config.productionTip = false
Vue.prototype.$http = axios
let vue = new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})