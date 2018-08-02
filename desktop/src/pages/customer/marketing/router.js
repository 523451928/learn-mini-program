/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import Coupon from '@/components/customer/marketing/Coupon'
import Collage from '@/components/customer/marketing/Collage'
import AddCoupon from '@/components/customer/marketing/coupon/AddCoupon'
import ModifyCoupon from '@/components/customer/marketing/coupon/ModifyCoupon'

Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/coupon'
    },
    {
      path: '/coupon',
      component: Coupon,
      meta: { title: '优惠券' },
      name: 'coupon',
      children: [
        {
          path: 'addcoupon', component: AddCoupon,
          meta: { title: '添加优惠券' },
          name: 'addcoupon'
        },
        {
          path: 'modifycoupon', component: ModifyCoupon,
          meta: { title: '修改优惠券' },
          name: 'modifycoupon'
        }
      ]
    },
    {
      path: '/collage',
      component: Collage,
      meta: { title: '拼团' }
    }
  ]
})
router.afterEach(to => { document.title = to.meta.title })
export default router