/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
// import Index from '@/components/customer/preview/index/index.vue'
// import Category from '@/components/customer/preview/category/Category.vue'
// import Detail from '@/components/customer/preview/detail/Detail.vue'
// import Search from '@/components/customer/preview/search/Search.vue'
// import Cart from '@/components/customer/preview/cart/Cart.vue'
// import Me from '@/components/customer/preview/me/Me.vue'
// import GoodsList from '@/components/customer/preview/goodsList/GoodsList.vue'
// import CouponList from '@/components/customer/preview/couponList/CouponList.vue'

const Index = resolve => require(['@/components/customer/preview/index/index.vue'], resolve)
const Category = resolve => require(['@/components/customer/preview/category/Category.vue'], resolve)
const Detail = resolve => require(['@/components/customer/preview/detail/Detail.vue'], resolve)
const Search = resolve => require(['@/components/customer/preview/search/Search.vue'], resolve)
const Cart = resolve => require(['@/components/customer/preview/cart/Cart.vue'], resolve)
const Me = resolve => require(['@/components/customer/preview/me/Me.vue'], resolve)
const GoodsList = resolve => require(['@/components/customer/preview/goodsList/GoodsList.vue'], resolve)
const CouponList = resolve => require(['@/components/customer/preview/couponList/CouponList.vue'], resolve)
// const CouponList = () => import('@/components/customer/preview/couponList/CouponList.vue')
// const CouponList =  function (resolve, reject) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 Ajax 请求自动下载。
//   require(['@/components/customer/preview/couponList/CouponList.vue'], resolve)
// }
Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: Index,
      name: 'index',
      meta: { title: '首页', keepAlive: true }
    },
    {
      path: '/category',
      component: Category,
      name: 'category',
      meta: { title: '分类', keepAlive: true }
    },
    {
      path: '/detail',
      component: Detail,
      meta: { title: '详情', keepAlive: false }
    },
    {
      path: '/cart',
      component: Cart,
      name: 'cart',
      meta: { title: '购物车', keepAlive: false }
    },
    {
      path: '/me',
      component: Me,
      name: 'me',
      meta: { title: '我的', keepAlive: true }
    },
    {
      path: '/goodsList',
      component: GoodsList,
      meta: { title: '列表', keepAlive: false },
      name: 'goodslist'
    },
    {
      path: '/couponList',
      component: CouponList,
      meta: { title: '我的优惠券', keepAlive: false },
      name: 'couponList'
    },
    {
      path: '/search',
      component: Search,
      meta: { title: '搜索', keepAlive: true }
    }
    // {
    //   path: '/allgoods',
    //   component: AllGoods,
    //   name: 'allgoods',
    //   meta: { title: '全部商品' },
    //   children: [
    //     {
    //       path: 'addgoods', component: AddGoods,
    //       meta: { title: '添加商品' }
    //     },
    //     {
    //       path: 'modifygoods', component: ModifyGoods,
    //       meta: { title: '编辑商品' }
    //     }
    //   ]
    // }
  ]
})
router.afterEach(to => { document.title = to.meta.title })
export default router