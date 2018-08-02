/* eslint-disable */
import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './app.vue'
import store from '@/store/user/undertake/store'
// import 'element-ui/lib/theme-chalk/display.css'
import 'assets/css/index.scss'
import '@/assets/css/data-flex.css' // flex兼容性布局方案
import axios from 'axios'
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
import { baseURL } from 'assets/js/utils'
axios.defaults.baseURL = baseURL
Vue.prototype.bus = new Vue()
Vue.prototype.$http = axios
Vue.use(Element)
Vue.config.productionTip = false
new Vue({
  el: '#app',
  render: h => h(App),
  store
})