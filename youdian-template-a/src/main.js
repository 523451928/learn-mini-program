import Vue from 'vue'
import App from './App'
require('@/assets/css/font.css')
require('@/assets/css/reset.scss')
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['pages/cart/main', '^pages/index/main', 'pages/category/main', 'pages/me/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '首页',
      navigationBarTextStyle: 'black'
    },
    "tabBar": {
      "list": [
        {
          "pagePath": "pages/index/main",
          "text": "首页",
          "iconPath": "/static/img/home.png",
          "selectedIconPath": "/static/img/home-active.png"
        },
        {
          "pagePath": "pages/category/main",
          "text": "分类",
          "iconPath": "/static/img/category.png",
          "selectedIconPath": "/static/img/category-active.png"
        },
        {
          "pagePath": "pages/cart/main",
          "text": "购物车",
          "iconPath": "/static/img/cart.png",
          "selectedIconPath": "/static/img/cart-active.png"
        },
        {
          "pagePath": "pages/me/main",
          "text": "我的",
          "iconPath": "/static/img/my.png",
          "selectedIconPath": "/static/img/my-active.png"
        }
      ],
      "color": "#b2b2b2",
      "selectedColor": "#fa5f62"
    }
  }
}
