/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import AllOrder from '@/components/customer/order/AllOrder'
import AfterSaleOrder from '@/components/customer/order/AfterSaleOrder'
import DeliveryOrder from '@/components/customer/order/DeliveryOrder'
import OrderDetail from '@/components/customer/order/normalorder/OrderDetail'
import DeliverGoods from '@/components/customer/order/normalorder/DeliverGoods'
import AfterSaleOrderDetail from '@/components/customer/order/aftersaleorder/OrderDetail'
import Drawback from '@/components/customer/order/aftersaleorder/Drawback'

Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/allorder'
    },
    {
      path: '/allorder',
      component: AllOrder,
      name: 'allorder',
      meta: { title: '全部订单' },
      children: [
        {
          path: 'orderdetail', 
          component: OrderDetail,
          meta: { title: '订单详情' }
        }
      ]
    },
    {
      path: '/aftersaleorder',
      component: AfterSaleOrder,
      name: 'aftersaleorder',
      meta: { title: '售后订单' },
      children: [
        {
          path: 'orderdetail',
          component: AfterSaleOrderDetail,
          meta: { title: '售后订单详情' }
        },
        {
          path: 'drawback',
          component: Drawback,
          meta: { title: '退款详情' }
        }
      ]
    },
    {
      path: '/deliveryorder',
      component: DeliveryOrder,
      name: 'deliveryorder',
      meta: { title: '发货订单' },
      children: [
        {
          path: 'orderdetail', component: OrderDetail,
          meta: { title: '订单详情' }
        },
        {
          path: 'delivergoods', component: DeliverGoods,
          meta: { title: '批量发货' }
        }
      ]
    }
  ]
})
router.afterEach(to => { document.title = to.meta.title })
export default router