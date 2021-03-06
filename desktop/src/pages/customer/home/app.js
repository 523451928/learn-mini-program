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
import store from 'src/store/customer/home/index.js'
import { baseURL } from 'assets/js/utils'
import '@/assets/css/data-flex.css' // flex兼容性布局方案
axios.defaults.baseURL = baseURL
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('credentials')
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
Vue.prototype.bus = new Vue() // 观察者订阅者模式
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