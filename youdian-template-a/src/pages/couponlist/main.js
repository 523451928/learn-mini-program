import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    "navigationBarBackgroundColor": "#fff",
    navigationBarTitleText: '我的优惠券'
  }
}
