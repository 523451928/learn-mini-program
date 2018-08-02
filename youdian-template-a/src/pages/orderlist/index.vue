<template>
  <div class="order-list-wrapper">
    <div class="tab-list">
      <ul>
        <li v-for="tab in tabList" :key="tab.value" :class="{'active-tab': activeValue==tab.value}" @click="changeTab(tab)">
          {{tab.label}}
        </li>
      </ul>
    </div>
    <div class="order-list-content">
      <ul>
        <li v-for="(order, index) in orderList" :key="order.orderId" class="order-item">
          <div class="order-header">
            <span>订单编号:</span> {{order.orderNumber}}
            <span class="fr" v-if="order.status == '1'" @click="cancelOrder(order)">取消订单</span>
            <span class="fr" v-if="order.cancelStatus === 0" @click="cancelApply(order)">取消申请</span>
          </div>
          <div class="order-content" @click="toDetail(order)">
            <ul v-if="order.orderItems.length == 1">
              <li v-for="(item, i) in order.orderItems" :key="i" class="clearfix">
                <img :src="item.productPictures[0]" alt="">
                <div class="goods-info">
                  <div class="goods-title">
                    <p>{{item.productTitle}}</p>
                    <span class="count"> <text>&times;</text> {{item.count}}</span>
                  </div>
                  <p class="goods-spec">
                    <span v-for="(spec, idx) in item.specifications" :key="idx">
                      {{spec.name}}:{{spec.value}}
                    </span>
                  </p>
                  <div class="price-box">
                    <span class="price">￥{{item.unitPrice}}</span>
                    <span class="fr">{{order.statusText}}</span>
                  </div>
                </div>
              </li>
            </ul>
            <ul v-else class="clearfix mutiple-goods">
              <li v-for="(item, i) in order.orderItems" :key="i" class="multiple-img clearfix">
                <img :src="item.productPictures[0]" v-if="i < 3" alt="">
              </li>
              <span class="status-text fr">{{order.statusText}}</span>
            </ul>
          </div>
          <div class="order-footer">
            <span class="fr">
              共{{order.orderItems.length}}件商品,实付款<span class="total-price">￥{{order.totalPrice}}</span>
              <span class="fr round-btn round-error-btn" @click="wxPay(order)" v-if="order.status == 0 || order.status == 1 || order.status == 2">去支付</span>
              <span class="fr round-btn round-error-btn" @click="comfirmReceipt(order, index)" v-if="order.status == 4 && activeValue != 'afterSale'">确认收货</span>
              <!-- <span class="fr round-btn round-error-btn" @click="buyAgain(order)" v-if="order.status == 7">再次购买</span> -->
            </span>
          </div>
        </li>
      </ul>
      <div class="no-order" v-if="orderList.length == 0">
        <image :src="noOrderImg" />
        <span>该分类下没有订单</span>
      </div>
      <div v-if="isAllLoaded && orderList.length" class="no-more">-没有更多订单了-</div>
      <mp-loading v-if="!isAllLoaded" :loadVisible="isLoadmore"></mp-loading>
    </div>
  </div>
</template>

<script>
import { baseURL, param } from '@/utils/index'
import { wxLogin } from '@/utils/login'
import { mixinsWxPay } from '@/utils/mixins'
import MpLoading from '@/components/public/MpLoading'
import store from '@/store/store'
export default {
  mixins: [ mixinsWxPay ],
  components: {
    MpLoading
  },
  data () {
    return {
      tabList: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 'stockConfirmed',
          label: '待付款'
        },
        {
          value: 'paid',
          label: '待发货'
        },
        {
          value: 'shipped',
          label: '待收货'
        },
        {
          value: 'afterSale',
          label: '售后服务'
        }
      ],
      activeValue: 'all',
      pageIndex: 1,
      pageSize: 5,
      PreStatus: null,
      orderObj: {},
      orderList: [],
      isLoadmore: true,
      isAllLoaded: false,
      noOrderImg: require('@/assets/img/no-order.png'),
      IncludePaymentMethods: null,
      IncludeCancelStatus: []
    }
  },
  methods: {
    buyAgain(order) {
      console.log(order)
    },
    toDetail(order) {
      if (this.activeValue == 'afterSale') {
        wx.navigateTo({
          url: `/pages/aftersale/main?orderId=${order.orderId}`
        })
      } else {
        wx.navigateTo({
          url: `/pages/orderdetail/main?orderId=${order.orderId}`
        })
      }
    },
    comfirmReceipt(order, index) {
      wx.showModal({
        title: '',
        content: '是否确认收货?',
        confirmColor: '#fa5f62',
        success: (res) => {
          if (res.confirm) {
            wx.$http({
              url: `${baseURL}/api/Order/accept`,
              method: 'PUT',
              data: {
                orderId: order.orderId
              },
              success: (res) => {
                console.log(res)
                if (this.activeValue == 'shipped') {
                  this.orderList.splice(index, 1)
                } else {
                  this.refreshOrder()
                }
              }
            })
          }
        }
      })
    },
    cancelApply(order) {
      wx.showModal({
        title: '',
        content: '确定要取消申请?',
        confirmColor: '#fa5f62',
        success: (res) => {
          if (res.confirm) {
            wx.$http({
              url: `${baseURL}/api/Order/cancellation/stop/${order.orderId}`,
              method: 'PUT',
              success: (res) => {
                this.refreshOrder()
              }
            })
          }
        }
      })
    },
    cancelOrder(order) {
      wx.showModal({
        title: '',
        content: '确定要取消订单?',
        confirmColor: '#fa5f62',
        success: (res) => {
          if (res.confirm) {
            wx.$http({
              url: `${baseURL}/api/Order/cancellation`,
              method: 'POST',
              data: {
                orderId: order.orderId,
                reason: '.'
              },
              success: (res) => {
                if (res.statusCode == 401) {
                  wxLogin().then(() => {
                    this.cancelOrder(order)
                  })
                  return
                } else if (res.statusCode == 500) {
                  wx.showToast({
                    title: '服务器异常',
                    icon: 'none'
                  })
                  return
                } else if (res.statusCode > 500) {
                  wx.showToast({
                    title: '服务器繁忙，请稍后重试',
                    icon: 'none'
                  })
                  return
                }
                this.refreshOrder()
              }
            })
          } else if (res.cancel) {
          }
        }
      })
    },
    refreshOrder() {
      this.pageIndex = 1
      this.orderList = []
      this.getOrder()
    },
    changeTab(tab) {
      this.activeValue = tab.value
      this.pageIndex = 1
      this.orderList = []
      if (tab.value == 'afterSale') {
        this.IncludePaymentMethods = 'Wechat'
        this.IncludeCancelStatus = [0, 1, 2]
      } else {
        this.IncludePaymentMethods = null
        this.IncludeCancelStatus = []
      }
      this.isAllLoaded = false
      wx.showNavigationBarLoading()
      this.getOrder()
    },
    getOrder() {
      let data = {
        StoreId: wx.getStorageSync('storeId'),
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        IncludePaymentMethods: this.IncludePaymentMethods
      }
      store.commit('setOrderRefresh', false)
      let url = `${baseURL}/api/Order/summarys`
      if (this.activeValue != 'all') {
        if (this.IncludeCancelStatus.length) {
          let str = this.IncludeCancelStatus.map((item) => {
            return 'IncludeCancelStatus' + '=' + item
          }).join('&')
          str += '&' + param(data)
          data = {}
          url = `${baseURL}/api/Order/summarys?${str}`
        } else {
          data.IncludeStatus = this.activeValue
        }
      } else {
        let includeStatus = [1, 3, 4, 5, 6, 7]
        let str = includeStatus.map((item) => {
          return 'IncludeStatus' + '=' + item
        }).join('&')
        str += '&' + param(data)
        data = {}
        url = `${baseURL}/api/Order/summarys?${str}`
      }
      wx.$http({
        url,
        data,
        success: (res) => {
          if (res.statusCode == 401) {
            wxLogin().then(() => {
              this.getOrder()
            })
            return
          }
          this.orderObj = res.data.data
          this.orderList = this.orderList.concat(this.orderObj.currentPageDatas)
          this.orderList.forEach((item) => {
            let status = item.status
            let cancelStatus = item.cancelStatus
            let paymentMethod = item.paymentMethod
            let text
            if (this.activeValue == 'afterSale') {
              switch (cancelStatus) {
                case 0:
                  text = '申请处理中'
                  break;
                case 1:
                  if (status == 6) {
                    text = '退款成功'
                  } else {
                    text = '退款中'
                  }
                  text = '退款成功'
                  break;
                case 2:
                  text = '申请退回'
                  break;
                case 3:
                  text = '已关闭'
                  break;
                default:
                  text = '已关闭'
                  break;
              }
            } else {
              switch (status) {
                case 0:
                case 1:
                case 2:
                  text = '待付款'
                  break;
                case 3:
                  text = '待发货'
                  break;
                case 4:
                  text = '待收货'
                  break;  
                case 5:
                case 6:
                  if (paymentMethod != null) {
                    switch (cancelStatus) {
                      case 0:
                        text = '申请退款中'
                        text = '售后处理中'
                        break;
                      case 1:
                        if (status == 5) {
                          text = '退款中'
                          text = '已关闭'
                        } else {
                          text = '退款成功'
                          text = '已关闭'
                        }
                        break;
                      case 2:
                        text = '申请退回'
                        text = '已关闭'
                        break;
                      case 3:
                        text = '已关闭'
                        break;
                      default:
                        text = '已关闭'
                        break;
                    }
                  } else {
                    text = '已关闭'
                  }
                  break;
                case 7:
                  text = '已完成'
                  break;  
                default:
                  break;
              }
            }
            this.$set(item, 'statusText', text)        
          })
          wx.hideNavigationBarLoading()
          if (this.orderObj.currentPageDatas.length < this.pageSize) {
            this.isAllLoaded = true
            this.isLoadmore = false
          }
        }
      })
    },
  },
  onReachBottom() {
    this.pageIndex++
    if (!this.isAllLoaded) {
      this.isLoadmore = true
      this.getOrder()
    }
  },
  computed: {
    isOrderListRefresh() {
      return store.state.isOrderListRefresh
    }
  },
  watch: {
    isOrderListRefresh(newVal) {
      if (newVal) {
        this.pageIndex = 1
        this.orderList = []
        this.getOrder()
      }
    }
  },
  mounted() {
    let query = this.$root.$mp.query
    if (query.status) {
      this.activeValue = query.status
      if (query.status == 'afterSale') {
        this.IncludePaymentMethods = 'Wechat'
        this.IncludeCancelStatus = [0, 1]
      } else {
        this.IncludePaymentMethods = null
        this.IncludeCancelStatus = []
      }
    }
    this.pageIndex = 1
    this.orderList = []
    // wx.showLoading({
    //   title: '加载中...'
    // })
    this.getOrder()
  }
}
</script>

<style lang="scss">
.order-list-wrapper{
  padding-top: 100rpx;
  min-height: 100%;
  box-sizing: border-box;
  background: #F5F5F5;
  .order-list-content{
    .no-more{
      line-height: 84rpx;
      background: #f5f5f5;
      text-align: center;
      color: #909090;
      font-size: 22rpx;
    }
    .no-order{
      text-align: center;
      span{
        color: #B3B3B3;
        font-size: 28rpx;
      }
      image{
        width: 180rpx;
        height: 180rpx;
        display: block;
        margin: 78rpx auto 30rpx auto;
      }
    }
    .order-item{
      box-sizing: border-box;
      padding: 0 32rpx;
      margin-bottom: 20rpx;
      background: #fff;
      &:last-child{
        margin-bottom: 0;
      }
      .order-header{
        height: 80rpx;
        line-height: 80rpx;
        z-index: 100;
        color: #353535;
        font-size: 24rpx;
        border-bottom: 1rpx solid #EDEDED;
        span{
          color: #888888;
        }
      }
      .order-footer{
        height: 80rpx;
        line-height: 80rpx;
        border-top: 1rpx solid #EDEDED;
        font-size: 26rpx;
        color: #353535;
        .total-price{
          color: #fa5f62;
        }
        .round-btn{
          display: inline-block;
          width: 160rpx;
          height: 60rpx;
          line-height: 60rpx;
          border-radius: 30rpx;
          text-align: center;
          box-sizing: border-box;
          font-size: 24rpx;
          margin: 10rpx 0 0 14rpx;
        }
        .round-default-btn{
          border: 1rpx solid #999999;
          background: #fff;
          color: #999999;
        }
        .round-error-btn{
          border: 1rpx solid #fa5f62;
          color: #fa5f62;
        }
      }
      .order-content{
        padding: 24rpx 0;
        .mutiple-goods{
          position: relative;
          .status-text{
            position: absolute;
            bottom: 0;
            right: 0;
            font-size: 24rpx;
            color: #fa5f62;
          }
        }
        .goods-info{
          position: relative;
          width: 100%;
          box-sizing: border-box;
          padding-left: 172rpx;
          .goods-title{
            position: relative;
            p{
              width: 80%;
              font-size: 26rpx;
              color: #333333;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .count{
              color: #888;
              font-size: 24rpx;
              position: absolute;
              top: 0;
              right: 0;
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
              color: #333333;
            }
            .fr{
              font-size: 24rpx;
              color: #fa5f62;
              margin-top: 8rpx;
            }
          }
        }
        img{
          width: 160rpx;
          height: 160rpx;
          display: inline-block;
          float: left;
          border-radius: 10px;
        }
        .multiple-img{
          float: left;
          margin-right: 24rpx;
        }
      }
    }
  }
  .tab-list{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    background: #fff;
    z-index: 100;
    ul{
      display: flex;
      li{
        flex: 1;
        text-align: center;
        position: relative;
        font-size: 26rpx;
        color: #353535;
      }
      .active-tab{
        color: #FA5F62;
        &:after{
          content: '';
          width: 60%;
          height: 4rpx;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          background: #FA5F62;
        }
      }
    }
  }
}
</style>
