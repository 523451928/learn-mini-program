/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/customer/home/Home'
import Register from '@/components/user/user/Register'

Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home,
      meta: { title: '首页' }
    },
    {
      path: '/register',
      component: Register,
      meta: { title: '注册' }
    }
  ]
})
router.afterEach(to => { document.title = to.meta.title })
export default router