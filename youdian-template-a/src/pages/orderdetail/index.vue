<template>
  <div class="order-detail">
    <div class="choose-address has-address">
      <img src="../../assets/img/order-detail-bg.png" alt="">
      <div class="status-bar">
        <span class="status-text">
          <text class="icon-mpmall iconfont" v-if="orderDetail.status == 0 || orderDetail.status == 1 || orderDetail.status == 2">&#xe609;</text>
          <text class="icon-mpmall iconfont" v-if="orderDetail.status == 3">&#xe60b;</text>
          <text class="icon-mpmall iconfont" v-if="orderDetail.status == 4">&#xe606;</text>
          <text class="icon-mpmall iconfont" v-if="orderStatusText == '售后处理中'">&#xe60c;</text>
          <text class="icon-mpmall iconfont" v-if="orderStatusText == '已关闭'">&#xe607;</text>
          <text class="icon-mpmall iconfont" v-if="orderDetail.status == 7">&#xe604;</text>
          {{orderStatusText}}
        </span>
        <span class="fr count-down" v-if="orderDetail.status == 1">
          支付剩余时间：{{hour}}时{{minute}}分
        </span>
        <span class="fr count-down" v-if="orderDetail.status == 4">
          还剩下：{{day}}天{{hour}}时自动确认
        </span>
      </div>
      <div class="selected-address">
        <p class="user-info">
          <span>{{receiver}}</span>
          <span>{{phone}}</span>
        </p>
        <p class="address-info">
          <text class="iconfont icon-mpmall">&#xe63f;</text>
          <span>{{provinceName}} </span>
          <span>{{cityName}} </span>
          <span>{{countyName}} </span>
          <span>{{orderDetail.details}}</span>
        </p>
      </div>
    </div>
    <div>
      <ul class="order-container" v-if="goodsList.length > 0">
        <li v-for="(item, index) in goodsList" :key="index" class="cart-item">
          <div class="goods-detail" :class="{'last-item': index == goodsList.length - 1}" >
            <img :src="item.skuPictureUri || item.productPictureUris[0]">
            <div class="goods-info">
              <p class="goods-title">{{item.productName}}</p>
              <p class="goods-spec">
                <span v-for="(spec, idx) in item.specifications" :key="idx">
                  {{spec.name}}:{{spec.value}}
                </span>
              </p>
              <div class="price-box">
                <span class="price">￥{{item.unitPrice}}</span>
                <!-- <span class="reality-price">￥{{item.sku.realityPrice}}</span> -->
                <span class="count fr"> <text>&times;</text> {{item.units}}</span>
              </div>
            </div>
          </div>
        </li>
        <div class="total-price panel-item">
          实付款
          <span class="fr">￥{{orderDetail.totalPrice}}</span>
        </div>
      </ul>
    </div>
    <div v-if="orderDetail.status == 4 || orderDetail.status == 7 || orderDetail.preStatusOnCancel == 7 || orderDetail.preStatusOnCancel == 4 || (orderDetail.status == 5 && preStatusOnCancel == 6)">
      <div class="panel-item order-panel">
        物流信息
      </div>
      <div class="order-info">
        <p >
          物流公司: {{logisticsDetail.companyName}}
        </p>
        <p >
          物流单号: <text selectable='true'>{{logisticsDetail.orderNumber}}</text>
          <span @click="copyText" class="fr copy-btn">复制</span>
        </p>
      </div>
    </div>
    <div class="panel-item order-panel">
      订单信息
    </div>
    <div class="order-info">
      <p>
        订单状态: {{orderStatusText}}
      </p>
      <p>
        订单编号: {{orderDetail.orderNumber}}
      </p>
      <p>
        下单时间: {{createTime}}
      </p>
      <p v-if="orderDetail.status == 4 ||  orderDetail.preStatusOnCancel == 7 || orderDetail.status == 7 || orderDetail.preStatusOnCancel == 7 || (orderDetail.status == 5 && orderDetail.preStatusOnCancel == 6)">
        支付时间: {{paidTime}}
      </p>
    </div>
    <div class="fixed-bottom-panel" >
      <span class="round-error-btn fr" v-if="orderDetail.status == 0 || orderDetail.status == 1 || orderDetail.status == 2" @click="wxPay(orderDetail)">付款</span>
      <span class="round-default-btn fr" v-if="orderDetail.status == 3 || orderDetail.status == 4 || orderDetail.status == 7" @click="applyAfterSale">申请售后</span>
      <button  class="round-default-btn fr"  v-if="storeInfo.isCustomerServiceTelNumberEnable" @click="contactService" >联系客服</button>
    </div>
  </div>
</template>

<script>
import { baseURL, formatDate, formatPhone, padLeftZero, strToDate } from '@/utils/index'
import { wxLogin } from '@/utils/login'
import { mixinsWxPay } from '@/utils/mixins'
import { findPlaceByValue } from '@/assets/json/area'
import store from '@/store/store'
export default {
  mixins: [ mixinsWxPay ],
  components: {
  },
  data () {
    return {
      goodsList: [],
      receiver: '',
      phone: '',
      createTime: '',
      paidTime: '',
      address: {
        provinceId: 0,
        cityId: 0,
        areaId: 0,
        street: "street",
        details: ""
      },
      provinceName: '',
      cityName: '',
      countyName: '',
      detailInfo: '',
      storeInfo: {},
      orderDetail: {},
      logisticsDetail: {},
      day: '0',
      hour: '00',
      minute: '00',
      iconText: ''
    }
  },
  methods: {
    contactService() {
      wx.makePhoneCall({
        phoneNumber: this.storeInfo.customerServiceTelNumber
      })
    },
    copyText() {
      wx.setClipboardData({
        data: this.logisticsDetail.orderNumber,
        success: function(res) {
          wx.getClipboardData({
            success: function(res) {
            
            }
          })
        }
      })
    },
    applyAfterSale() {
      store.commit('setOrderDetail', this.orderDetail)
      wx.navigateTo({
        url: '/pages/aftersale/main'
      })
    },
    getOrderDetail(id) {
      wx.$http({
        url: `${baseURL}/api/Order/${id}`,
        success: (res)=> {
          if (res.statusCode == 401) {
            wxLogin().then(() => {
              this.getOrderDetail(id)
            })
            return
          }
          this.orderDetail = res.data.data
          this.orderDetail.totalPrice = this.orderDetail.totalPrice.toFixed(2)
          this.createTime = formatDate(this.orderDetail.createTime, '-')
          this.provinceName = findPlaceByValue(this.orderDetail.provinceCode).label
          this.cityName = findPlaceByValue(this.orderDetail.cityCode).label
          this.countyName = findPlaceByValue(this.orderDetail.areaCode).label
          this.phone = formatPhone(this.orderDetail.phone)
          this.receiver = this.orderDetail.receiver
          this.goodsList= this.orderDetail.items
          if (this.orderDetail.status == 1) {
            let endTime = strToDate(this.orderDetail.createTime).getTime() + 24*60*60*1000
            this.countDown(endTime)
          }
          if (this.orderDetail.status == 4 || this.orderDetail.preStatusOnCancel == 4 || this.orderDetail.status == 7 || this.orderDetail.preStatusOnCancel == 7 || (this.orderDetail.status == 5 && this.orderDetail.preStatusOnCancel == 6)) {
            wx.$http({
              url: `${baseURL}/api/wechat/payment/order`,
              data: {
                appId:  wx.getStorageSync('appId'),
                orderNumber: this.orderDetail.orderNumber
              },
              success: (res) => {
                this.paidTime = res.data.data.paidTime
              }
            })
            wx.$http({
              url: `${baseURL}/api/Order/logistics`,
              data: {
                orderNumber: this.orderDetail.orderNumber
              },
              success: (res) => {
                this.logisticsDetail = res.data.data
                let endTime = strToDate(this.logisticsDetail.createTime).getTime() + 24*60*60*1000*15
                this.countDown(endTime)
              }
            })
          }
        }
      })
    },
    countDown(endTime) {
      this.day = parseInt((endTime - Date.now()) / 1000 / 60 / 60 / 24, 10)
      this.hour = padLeftZero(parseInt((endTime - Date.now()) / 1000 / 60 / 60 % 24 , 10))
      this.minute = padLeftZero(parseInt((endTime - Date.now()) / 1000 / 60 % 60 , 10))
      setInterval(() => {
        this.day = parseInt((endTime - Date.now()) / 1000 / 60 / 60 / 24 , 10)
        this.hour = padLeftZero(parseInt((endTime - Date.now()) / 1000 / 60 / 60 % 24 , 10))
        this.minute = padLeftZero(parseInt((endTime - Date.now()) / 1000 / 60 % 60 , 10))
      }, 60000)
    }
  },
  computed: {
    orderStatusText() {
      let text
      let status = this.orderDetail.status
      let paymentMethod = this.orderDetail.paymentMethod
      let cancelStatus = this.orderDetail.cancelStatus
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
      return text
    }
  },
  onShow() {
    let orderId = this.$root.$mp.query.orderId || 29
    this.storeInfo = store.state.storeInfo
    // wx.$http({
    //   url: `${baseURL}/api/store/${ wx.getStorageSync('storeId')}`,
    //   success: (res) => {
    //     if (res.statusCode == 200) {
    //       this.storeInfo = res.data.data
    //     }
    //   }
    // })
    this.getOrderDetail(orderId)
  }
}
</script>

<style lang="scss">
.order-detail{
  background: #f5f5f5;
  padding-bottom: 98rpx;
  min-height:100%;
  box-sizing:border-box;
  // .panel-title{
    
  // }
  .order-info{
    background: #fff;
    box-sizing: border-box;
    padding: 32rpx;
    font-size: 26rpx;
    p{
      font-size: 26rpx;
      color: #888888;
      margin-bottom: 24rpx;
      .copy-btn{
        color: #999999;
        font-size: 22rpx;
        width:80rpx;
        height:40rpx;
        line-height: 40rpx;
        text-align: center;
        background:rgba(255,255,255,1);
        border: 1rpx solid #999999;
        margin-top: -10rpx;
        border-radius:20rpx;
      }
    }
  }
  .panel-item{
    line-height: 90rpx;
    background: #fff;
    box-sizing: border-box;
    padding: 0 32rpx;
    margin-top: 24rpx;
    font-size: 26rpx;
  }
  .order-panel{
    border-bottom: 1rpx solid #f0f0f0;
  }
  .remark-item{
    font-size:30rpx;
    input{
      display: inline-block;
      // float:right;
      color:#666666;
      width: 80%;
      position: relative;
      // top: 15rpx;
      left: 8rpx;
      font-size: 30rpx;
    }
  }
  .fixed-bottom-panel{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    line-height: 98rpx;
    height: 98rpx;
    box-sizing: border-box;
    padding-top: 20rpx;
    text-align: center;
    background: #fff;
    font-size: 36rpx;
    box-shadow: 0 0 10px 0 hsla(0,6%,58%,.6);
    button,span{
      display: inline-block;
      width: 164rpx;
      height: 56rpx;
      line-height: 56rpx;
      border-radius: 28rpx;
      text-align: center;
      box-sizing: border-box;
      font-size: 26rpx;
      margin-right: 32rpx;
    }
    .round-default-btn{
      border: 1rpx solid #999999;
      background: #fff;
      color: #999999;
    }
    .round-error-btn{
      background: #fa5f62;
      color: #fff;
    }
  }
  .has-address{
    height: 170rpx;
    position: relative;
    box-sizing: border-box;
    margin-bottom: 140rpx;
    // background: url('../../assets/img/order-detail-bg.png');
    .status-bar{
      position: absolute;
      top: 34rpx;
      left: 32rpx;
      right: 32rpx;
      color: #fff;
      .status-text{
        font-size: 32rpx;
      }
      .count-down{
        font-size: 24rpx;
        margin-top: 10rpx;
      }
    }
    img{
      width: 100%;
      height: 170rpx;
    }
    .selected-address{
      color: #333333;
      background: #fff;
      position: absolute;
      top: 100rpx;
      left: 32rpx;
      right: 32rpx;
      padding: 40rpx 30rpx;
      border-radius: 10rpx;
      .user-info{
        margin-bottom: 24rpx ;
        span{
          margin-right: 42rpx;
          font-size: 36rpx;
        }
      }
      .address-info{
        width: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 24rpx;
        white-space: nowrap;
        .icon-mpmall{
          font-size: 36rpx;
          color: #333333;
          margin-right: 16rpx;
        }
      }
    }
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
      padding: 24rpx 32rpx 0 32rpx;
      transition: all .3s;
      width:100%;
      box-sizing:border-box;
      position: relative;
      .goods-detail{
        height: 160rpx;
        border-bottom: 1rpx solid #EDEDED;
        padding-bottom: 24rpx;
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
            white-space: nowrap;
            width: 90%;
            overflow: hidden;
            text-overflow: ellipsis;
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
      .last-item{
        border: none;
      }
    }
  }
}

</style>
