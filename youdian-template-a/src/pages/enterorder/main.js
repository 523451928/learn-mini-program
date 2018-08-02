import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    backgroundColor: "#eeeeee",
    navigationBarBackgroundColor: "#f0f0f0",
    navigationBarTitleText: '确认订单'
  }
}
