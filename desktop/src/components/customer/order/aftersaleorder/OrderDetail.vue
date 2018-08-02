<template>
  <div class="order-detail"  v-loading="loading">
    <div class="detail-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item >订单管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="orderRouter">{{orderRouter.text}}</el-breadcrumb-item>
        <el-breadcrumb-item>售后详情</el-breadcrumb-item>
      </el-breadcrumb>
      <p>售后详情</p>
    </div>
    <receiver-info :orderDetail="orderDetail"></receiver-info>
    <order-info :orderDetail="orderDetail"></order-info>
    <logistic-info v-if="logisticsDetail.companyName"></logistic-info>
  </div>
</template>

<script>
import OrderInfo from './orderdetail/OrderInfo'
import ReceiverInfo from './orderdetail/ReceiverInfo'
import LogisticInfo from './orderdetail/LogisticInfo'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    OrderInfo,
    ReceiverInfo,
    LogisticInfo
  },
  data() {
    return {
      orderDetail: {},
      orderRouter: {
        path: '/aftersaleorder',
        text: '售后订单'
      },
      loading: true
    }
  },
  methods: {
    ...mapMutations([
      'setAppId','setLogisticsDetail'
    ]),
    getOrderDetail(id) {
      this.$http.get(`/api/Order/${id}`).then((res) => {
        this.orderDetail = res.data.data
        if (!this.appId) {
          this.$http.get('/api/wechat/miniapp', {
            params: {
              storeId: localStorage.getItem('storeId')
            }
          }).then((res) => {
            this.setAppId(res.data.data.appId)
            this.getPaymentOrder(this.appId, this.orderDetail.orderNumber)
            if (this.orderDetail.cancelStatus == 1) {
              this.getPaymentRefund(this.appId, this.orderDetail.orderNumber)
            }
          })
        } else {
          this.getPaymentOrder(this.appId, this.orderDetail.orderNumber)
          if (this.orderDetail.cancelStatus == 1) {
            this.getPaymentRefund(this.appId, this.orderDetail.orderNumber)
          }
        }
        this.loading = false
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getOrderDetail(id)
        })
      })
    },
    getPaymentRefund(appId, orderNumber) {
      this.$http.get('/api/wechat/payment/refund', {params: {
        appId,
        orderNumber
      }}).then((res) => {
        let reg = new RegExp( '-' , "g" )
        this.orderDetail = {...this.orderDetail, ...res.data.data}
        this.orderDetail.refundSuccessTime = this.orderDetail.refundSuccessTime.replace(reg, '/')
      })
    },
    getPaymentOrder(appId, orderNumber) {
      this.$http.get('/api/wechat/payment/order', {params: {
        appId,
        orderNumber
      }}).then((res) => {
        if (res.data.data.status == 'SUCCESS' || res.data.data.status == 'REFUND') {
          let reg = new RegExp( '-' , "g" )
          this.orderDetail = {...this.orderDetail, ...res.data.data}
          this.orderDetail.paidTime = this.orderDetail.paidTime.replace(reg, '/')
        }
      })
    }
  },
  computed: {
    ...mapState([
      'appId',
      'logisticsDetail'
    ])
  },
  mounted() {
    let orderId = this.$router.currentRoute.query.orderid
    this.setLogisticsDetail({})
    this.getOrderDetail(orderId)
  }
}
</script>

<style lang="scss">
.order-detail{
  .detail-header{
    padding: 30px 24px 1px 24px;
    margin-bottom: 24px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    p{
      font-size: 20px;
      color: #303133;
      margin: 15px 0 28px 0;
    }
  }
}
</style>
