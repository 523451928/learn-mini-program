/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import ProductRenovation from '@/components/customer/product/ProductRenovation'
import ProductTemplate from '@/components/customer/product/ProductTemplate'

Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/producttemplate'
    },
    {
      path: '/productrenovation',
      component: ProductRenovation,
      meta: { title: '店铺装修' },
      name: 'productrenovation'
    },
    {
      path: '/producttemplate',
      component: ProductTemplate,
      meta: { title: '店铺模板' }
    }
  ]
})
router.afterEach(to => { document.title = to.meta.title })
export default router