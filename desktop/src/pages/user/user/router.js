/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import Login from 'components/user/user/Login'
import Register from 'components/user/user/Register'
import ResetPwd from 'components/user/user/ResetPwd'
import UrlInvalid from 'components/user/user/UrlInvalid'
import SetSubpwd from 'components/user/user/SetSubpwd'
import ForgetPwd from 'components/user/user/ForgetPwd'
Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login,
      meta: { title: '登录' }
    },
    {
      path: '/register',
      component: Register,
      meta: { title: '注册' }
    },
    {
      path: '/resetpwd',
      component: ResetPwd,
      meta: { title: '重置密码' }
    },
    {
      path: '/urlinvalid',
      component: UrlInvalid,
      meta: { title: '重置密码' }
    },
    {
      path: '/setsubpwd',
      component: SetSubpwd,
      meta: { title: '设置子账号密码' }
    },
    {
      path: '/forgetpwd',
      component: ForgetPwd,
      meta: { title: '忘记密码' }
    }
  ]
})
router.afterEach(to => { document.title = to.meta.title })
export default router