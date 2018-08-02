/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import SelectShop from 'components/mpshop/shop/SelectShop'
import CreateShop from 'components/mpshop/shop/CreateShop'
import ModifyPwd from 'components/mpshop/shop/ModifyPwd'

Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/selectshop'
    },
    {
      path: '/selectshop',
      component: SelectShop,
      meta: { title: '选择店铺' }
    },
    {
      path: '/createshop',
      component: CreateShop,
      meta: { title: '创建店铺' }
    },
    {
      path: '/modifypwd',
      component: ModifyPwd,
      meta: { title: '修改密码' }
    }
  ]
})
router.afterEach(to => { document.title = to.meta.title })
export default router