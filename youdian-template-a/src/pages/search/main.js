import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    "navigationBarBackgroundColor": "#f5f5f5",
    navigationBarTitleText: '搜索'
  }
}
