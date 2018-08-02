<template>
  <div class="pay-fail">
    <img src="../../assets/img/pay-fail.png" alt="">
    <p class="status-text">支付失败</p>
    <p class="order-code">订单编号：{{orderInfo.orderNumber}}</p>
    <p class="count-down">
      请在<span>{{hour}}小时{{minute}}分</span>内完成支付，否则订单会被系统取消
    </p>
    <span @click="payAgain" class="warn-btn mp-btn">重新支付</span>
    <span @click="toOrderDetail" class="default-btn mp-btn">查看订单</span>
  </div>
</template>

<script>
import { padLeftZero, baseURL, strToDate } from '@/utils/index'

export default {
  components: {
  },
  data () {
    return {
      orderInfo: {},
      createTime: "2018-06-28T14:40:10",
      hour: '00',
      minute: '00',
      second: '00'
    }
  },
  methods: {
    toOrderDetail() {
      wx.navigateTo({
        url: `/pages/orderdetail/main?orderId=${this.orderInfo.orderId}`
      })
    },
    payAgain() {
      wx.$http({
        url: `${baseURL}/api/wechat/payment/order/${this.orderInfo.orderId}`,
        method: 'PUT',
        success: (res) => {
          let data = res.data.data
          wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            'success': (res) => {
              wx.navigateTo({
                url: `/pages/paysuccess/main?orderId=${this.orderInfo.orderId}&orderNumber=${this.orderInfo.orderNumber}`
              })
            },
            'fail': (res) => {
              console.log(res)
              // wx.navigateTo({
              //   url: `/pages/payfail/main?orderId=${this.orderInfo.orderId}&orderNumber=${this.orderInfo.orderNumber}`
              // })
            }
          })
        }
      })
    }
  },
  computed: {
    endTime() {
      if (this.createTime) {
        return strToDate(this.createTime).getTime() + 24*60*60*1000
      }
    }
  },
  onUnload() {
    // wx.switchTab({
    //   url: '/pages/cart/main'
    // })
  },
  mounted() {
    this.orderInfo = this.$root.$mp.query
    wx.$http({
      url: `${baseURL}/api/Order/${this.orderInfo.orderId}`,
      success: (res) => {
        console.log(res.data.data)
        this.createTime = res.data.data.createTime
        this.hour = padLeftZero(parseInt((this.endTime - Date.now()) / 1000 / 60 / 60 % 24 , 10))
        this.minute = padLeftZero(parseInt((this.endTime - Date.now()) / 1000 / 60 % 60 , 10))
      }
    })
    setInterval(() => {
      this.hour = padLeftZero(parseInt((this.endTime - Date.now()) / 1000 / 60 / 60 % 24 , 10))
      this.minute = padLeftZero(parseInt((this.endTime - Date.now()) / 1000 / 60 % 60 , 10))
      this.second = padLeftZero(parseInt((this.endTime - Date.now())  / 1000 % 60))
    }, 60000)
  }
}
</script>

<style lang="scss">
.pay-fail{
  text-align: center;
  box-sizing: border-box;
  padding: 80rpx 32rpx;
  .count-down{
    font-size: 26rpx;
    color: #666666;
    margin-bottom: 78rpx;
    span{
      color: #fa5f62;
    }
  }
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
    margin-bottom: 32rpx;
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
