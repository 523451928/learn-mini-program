<template>
  <div class="pay-success">
    <img src="../../assets/img/pay-success.png" alt="">
    <p class="status-text">支付成功</p>
    <p class="order-code">订单编号：{{orderInfo.orderNumber}}</p>
    <span @click="toOrderDetail" class="warn-btn mp-btn">查看订单</span>
    <span @click="toHome" class="default-btn mp-btn">回到首页</span>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      orderInfo: {}
    }
  },
  methods: {
    toOrderDetail() {
      wx.navigateTo({
        url: `/pages/orderdetail/main?orderId=${this.orderInfo.orderId}`
      })
    },
    toHome() {
      wx.reLaunch({ url: '/pages/index/main' })
    }
  },
  mounted() {
    this.orderInfo = this.$root.$mp.query
  }
}
</script>

<style lang="scss">
.pay-success{
  text-align: center;
  box-sizing: border-box;
  padding: 80rpx 32rpx;
  img{
    width: 176rpx;
    height: 176rpx;
  }
  .status-text{
    margin: 32rpx 0;
    font-size: 36rpx;
    color: #333333;
  }
  .order-code{
    font-size: 26rpx;
    color: #999999;
    margin-bottom: 78rpx;
  }
  .mp-btn{
    display: inline-block;
    width: 100%;
    line-height: 88rpx;
    font-size: 32rpx;
    text-align: center;
    border-radius: 8rpx;
    margin-bottom: 38rpx;
    box-sizing: border-box;
  }
  .warn-btn{
    background: #fa5f62;
    color: #fff;
  }
  .default-btn{
    border: 1rpx solid #999999;
    color: #666666;
  }
}
</style>
