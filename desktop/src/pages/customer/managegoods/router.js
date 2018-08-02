/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import AllGoods from '@/components/customer/managegoods/AllGoods'
// import AddGoods from '@/components/customer/managegoods/allgoods/AddGoods'
// import ModifyGoods from '@/components/customer/managegoods/allgoods/ModifyGoods'
const AddGoods = resolve => require(['@/components/customer/managegoods/allgoods/AddGoods'], resolve)
const ModifyGoods = resolve => require(['@/components/customer/managegoods/allgoods/ModifyGoods'], resolve)
import GroupGoods from '@/components/customer/managegoods/GroupGoods'
import ManageSubaccount from '@/components/customer/setting/ManageSubaccount'

Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/allgoods'
    },
    {
      path: '/allgoods',
      component: AllGoods,
      name: 'allgoods',
      meta: { title: '全部商品' },
      children: [
        {
          path: 'addgoods', component: AddGoods,
          meta: { title: '添加商品' }
        },
        {
          path: 'modifygoods', component: ModifyGoods,
          meta: { title: '编辑商品' }
        }
      ]
    },
    {
      path: '/groupgoods',
      component: GroupGoods,
      meta: { title: '商品分组' }
    },
    {
      path: '/importgoods',
      component: ManageSubaccount,
      meta: { title: '商品导入' }
    }
  ]
})
router.afterEach(to => { document.title = to.meta.title })
export default router