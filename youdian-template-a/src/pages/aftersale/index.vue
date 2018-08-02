<template>
  <div class="aftersale-container">
      <div class="apply-aftersale" v-if="isApply">
        <div>
          <ul class="order-container" v-if="orderDetail.items && orderDetail.items.length > 0">
            <li v-for="(item, index) in orderDetail.items" :key="index" class="cart-item">
              <div class="goods-detail">
                <img :src="item.skuPictureUri || item.productPictureUris[0]">
                <div class="goods-info">
                  <p class="goods-title">
                    <span class="product-name">
                       {{item.productName}}
                    </span>
                    <span class="count fr"> <text>&times;</text> {{item.units}}</span>
                  </p>
                  <p class="goods-spec">
                    <span v-for="(spec, idx) in item.specifications" :key="idx">
                      {{spec.name}}:{{spec.value}}
                    </span>
                  </p>
                  <div class="price-box">
                    <span class="price">￥{{item.unitPrice}}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="drawback-explain">
          <p>退款说明</p>
          <textarea v-model="reason" placeholder="请在此描述遇到的问题" maxlength="100" auto-focus />
        </div>
        <div class="drawback-money">
          退款金额 <span>￥{{orderDetail.totalPrice}}</span>
        </div>
        <div class="drawback-text">
          最多{{orderDetail.totalPrice}},含发货邮费￥{{orderDetail.freight}}
        </div>
        <div class="payment-type">
          <p>退款方式</p>
          <span>仅退款</span>
        </div>
        <span class="submit-btn active" :class="{'active': reason.length > 0}" @click="submitApply">提交申请</span>
      </div>
      <div v-else class="aftersale-detail">
        <div class="aftersale-status">
          <img v-if="orderDetail.cancelStatus == 0" src="../../assets/img/order-wait.png" alt="">
          <img v-if="orderDetail.cancelStatus == 2" src="../../assets/img/order-back.png" alt="">
          <img v-if="orderDetail.cancelStatus == 3" src="../../assets/img/order-back.png" alt="">
          <img v-if="orderDetail.cancelStatus == 1" src="../../assets/img/order-success-money.png" alt="">
          <p class="status-text">{{statusText}}</p>
          <p class="apply-time">
            申请时间{{applyTime}}
          </p>
        </div>
        <div v-if="orderDetail.cancelStatus != 2">
          <div class="aftersale-item">
            退款金额
            <span class="fr money">￥{{orderDetail.totalPrice}}</span>
          </div>
          <div class="drawback-explain">
            <p>退款说明</p>
            {{reason}}
          </div>
          <div class="aftersale-item">
            退款方式
            <span class="fr">仅退款</span>
          </div>
        </div>
        <div v-else>
          <div class="reject-reason">
            <p>退回原因</p>
            {{orderDetail.cancelAbortReason}}
          </div>
          <div class="aftersale-item">
            <p>售后申请</p>
          </div>
          <div class="aftersale-info">
            <p>退款金额: ￥{{orderDetail.totalPrice}}</p>
            <p>退款方式: 仅退款</p>
            <p>退款说明: {{reason}}</p>
          </div>
        </div>
        <span class="active submit-btn" v-if="orderDetail.cancelStatus == 0" @click="cancelApply">取消申请</span>
        <span class="active submit-btn" v-if="orderDetail.cancelStatus == 2" @click="modifyApply">修改申请</span>
      </div>
  </div>
</template>

<script>
import { baseURL, formatDate } from '@/utils/index'
import { wxLogin } from '@/utils/login'
import store from '@/store/store'
export default {
  components: {
  },
  data () {
    return {
      isApply: true,
      orderDetail: {},
      reason: '',
      applyTime: ''
    }
  },
  methods: {
    // cancelStatus [ Canceling, Canceled, Aborted, Stop ]
    getOrderDetail(id) {
      wx.$http({
        url: `${baseURL}/api/Order/${id}`,
        success: (res)=> {
          if (res.statusCode == 401) {
            wxLogin().then(() => {
              this.getOrderDetail(id)
            })
          }
          this.orderDetail = res.data.data
          this.reason = this.orderDetail.cancelReason
          this.applyTime = formatDate(this.orderDetail.cancelCreateTime)
          console.log(this.orderDetail)
        }
      })
    },
    modifyApply() {
      this.isApply = true
    },
    cancelApply() {
      wx.showModal({
        title: '',
        content: '确定要取消申请?',
        confirmColor: '#fa5f62',
        success: (res) => {
          if (res.confirm) {
            wx.$http({
              url: `${baseURL}/api/Order/cancellation/stop/${this.orderDetail.orderId}`,
              method: 'PUT',
              success: (res) => {
                store.commit('setOrderRefresh', true)
                wx.navigateBack({
                  delta: 1
                })
              },
              fail: (err) => {
                console.log(err.response)
                wx.showToast({
                  title: '取消失败，商家已处理申请',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          }
        }
      })
    },
    submitApply() {
      wx.$http({
        url: `${baseURL}/api/Order/cancellation`,
        method: 'POST',
        data: {
          orderId: this.orderDetail.orderId,
          reason: this.reason
        },
        success: (res) => {
          console.log(res)
          this.isApply = false
          this.applyTime = formatDate(Date.now())
          store.commit('setOrderRefresh', true)
          this.orderDetail.cancelStatus = 0
        }
      })
    }
  },
  computed: {
    statusText() {
      let text = '处理中'
      let cancelStatus = this.orderDetail.cancelStatus
      if (cancelStatus || cancelStatus === 0) {
        switch (cancelStatus) {
          case 0:
            text = '处理中'
            break;
          case 1:
            text = '退款成功'
            break;
          case 2:
            text = '申请退回'
            break;
          case 3:
            text = '取消申请'
            break;
          default:
            break;
        }
      }
      return text
    }
  },
  mounted() {
    let orderId = this.$root.$mp.query.orderId
    this.orderId = orderId
    if (orderId) {
      this.getOrderDetail(orderId)
      this.isApply = false
    } else {
      this.isApply = true
      this.reason = ''
    }
    this.orderDetail = store.state.orderDetail
    if (!this.isApply) {
      wx.setNavigationBarTitle({
        title: '查看售后'
      })
    }
  }
}
</script>

<style lang="scss">
.aftersale-container{
  min-height: 100%;
  background: #f5f5f5;
  box-sizing: border-box;
  padding-bottom: 50rpx;
  .aftersale-detail{
    .reject-reason{
      background: #fff;
      padding:0 34rpx 20rpx 34rpx;
      margin-bottom: 20rpx;
      font-size: 24rpx;
      color: #333333;
      line-height: 26rpx;
      p{
        line-height: 90rpx;
        font-size: 26rpx;
      }
    }
    .aftersale-item{
      height: 90rpx;
      line-height: 90rpx;
      box-sizing: border-box;
      padding: 0 34rpx;
      background: #fff;
      font-size: 26rpx;
      border-bottom: 1rpx solid #F5F5F5;
      color: #333333;
      .fr{
        color: #999999;
      }
      .money{
        color: #FA5F62;
      }
    }
    .aftersale-info{
      padding: 32rpx 10rpx 10rpx 34rpx;
      background: #fff;
      font-size: 24rpx;
      color: #999999;
      p{
        margin-bottom: 16rpx;
      }
    }
    .aftersale-status{
      background: #fff;
      padding: 60rpx 0 28rpx 0;
      margin-bottom: 20rpx;
      text-align: center;
      font-size: 26rpx;
      img{
        width: 160rpx;
        height: 160rpx;
        display: block;
        margin: 0 auto;
      }
      .status-text{
        color: #333333;
        margin: 20rpx 0 16rpx 0;
      }
      .apply-time{
        color: #999999;
      }
    }
    .drawback-explain{
      padding: 32rpx 32rpx 28rpx 32rpx;
      background: #fff;
      border-bottom: 1rpx solid #F5F5F5;
      color: #333333;
      font-size: 24rpx;
      p{
        font-size: 26rpx;
        margin-bottom: 20rpx;
      }
    }
  }
  .submit-btn{
    display: block;
    width: 500rpx;
    height: 80rpx;
    border-radius: 10rpx;
    line-height: 80rpx;
    text-align: center;
    color: #999;
    background: #E6E6E6;
    font-size: 32rpx;
    margin: 150rpx auto 50rpx auto;
  }
  .active{
    background:rgba(250,95,98,1);
    box-shadow:10rpx 0px 10rpx rgba(250,95,98,0.3);
    color: #fff;
  }
  .apply-aftersale{
    .drawback-explain{
      padding: 32rpx 32rpx 10rpx 32rpx;
      background: #fff;
      margin-bottom: 20rpx;
      border-bottom: 1rpx solid #F5F5F5;
      p{
        color: #333333;
        font-size: 26rpx;
        margin-bottom: 20rpx;
      }
      textarea{
        height: 110rpx;
        width: 100%;
        font-size: 24rpx;
      }
    }
    .payment-type{
      padding: 32rpx;
      background: #fff;
      p{
        color: #333333;
        font-size: 26rpx;
        margin-bottom: 20rpx;
      }
      span{
        display: inline-block;
        width: 160rpx;
        height: 60rpx;
        line-height: 60rpx;
        border-radius: 30rpx;
        background: #FA5F62;
        color: #fff;
        font-size: 26rpx;
        text-align: center;
      }
    }
    .drawback-money{
      padding-left: 32rpx;
      line-height: 90rpx;
      font-size: 26rpx;
      background: #fff;
      color: #333333; 
      span{
        margin-left: 32rpx;
        color: #FA5F62;
      }
    }
    .drawback-text{
      padding-left: 32rpx;
      line-height: 70rpx;
      font-size: 22rpx;
      color: #CCCCCC;
    }
    .order-container{
      width: 100%;
      margin-bottom: 24rpx;
      overflow-x: hidden;
      .total-price{
        margin-top: 0;
        border-top: 1rpx solid #f0f0f0;
        span{
          color: #fa5f62;
        }
      }
      .cart-item{
        background: #fff;
        padding: 24rpx;
        transition: all .3s;
        width:100%;
        box-sizing:border-box;
        position: relative;
        .goods-detail{
          height: 160rpx;
          .delete-btn{
            position: absolute;
            right: 8rpx;
            top: 0;
            font-size: 24rpx;
            color: #888888;
          }
          .num-wrap {
            top: -3rpx;
            right:-12rpx;
          }
          img{
            width: 160rpx;
            height: 160rpx;
            border-radius: 8rpx;
            float: left;
          }
          .goods-info{
            position: relative;
            width: 100%;
            box-sizing: border-box;
            padding-left: 172rpx;
            .goods-title{
              font-size: 24rpx;
              color: #353535;
              .product-name{
                display: inline-block;
                width: 80%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
            .goods-spec{
              height: 88rpx;
              span{
                font-size: 22rpx;
                color: #b2b2b2;
              }
            }
            .price-box{
              .price{
                font-size: 30rpx;
                color: #fa5f62;
              }
              .reality-price{
                font-size: 20rpx;
                color: #b2b2b2;
                margin-left: 4rpx;
                text-decoration: line-through;
              }
              .count{
                color: #888;
                font-size: 24rpx;
              }
            }
          }
        }
      }
    }
  }
}

</style>
