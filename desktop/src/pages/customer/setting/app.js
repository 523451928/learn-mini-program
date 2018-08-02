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
import store from '@/store/customer/setting/store'
Vue.use(Element)
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('credentials')
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.log(error.response)
          // let innerErrors = error.response.data.error.innerErrors
          // innerErrors.length ? vue.$message.error(innerErrors.map(item => item.reason).join(' ')) : vue.$message.error(error.response.data.error.message)
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
import { baseURL } from 'assets/js/utils'
axios.defaults.baseURL = baseURL
Vue.prototype.loginAgain = loginAgain
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('assets/imgs/loading.gif'),
  attempt: 1
})
Vue.config.productionTip = false
Vue.prototype.$http = axios
let vue = new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})