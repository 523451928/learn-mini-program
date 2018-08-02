<template>
  <div class="enter-order">
    <div class="choose-address" @click="getAddressInfo" :class="{'has-address': receiver}">
      <div class="select-address" v-if="!receiver">
        <text class="iconfont icon-mpmall">&#xe63f;</text>
        <span>选择收货地址</span>
        <text class="fr iconfont icon-mpmall">&#xe638;</text>
      </div>
      <div class="selected-address" v-else>
        <p class="user-info">
          <span>{{receiver}}</span>
          <span>{{formatPhoneStr}}</span>
        </p>
        <p class="address-info">
          <span>{{provinceName}} </span>
          <span>{{cityName}} </span>
          <span>{{countyName}} </span>
          <span>{{detailInfo}}</span>
        </p>
        <text class="fr iconfont icon-mpmall">&#xe638;</text>
      </div>
      <div class="address-line"></div>
    </div>
    <div>
      <ul class="order-container" v-if="orderList.length > 0">
        <li v-for="(item, index) in orderList" :key="index" class="cart-item">
          <div class="goods-detail" :class="{'last-item': index == orderList.length - 1}">
            <img :src="item.imgUrl">
            <div class="goods-info">
              <p class="goods-title">{{item.title}}</p>
              <p class="goods-spec">
                <span v-for="(spec, idx) in item.sku.specifications" :key="idx">
                  {{spec.name}}:{{spec.value}}
                </span>
              </p>
              <div class="price-box">
                <span class="price">￥{{item.sku.price}}</span>
                <!-- <span class="reality-price">￥{{item.sku.realityPrice}}</span> -->
                <span class="count fr"> <text>&times;</text> {{item.count}}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="panel-item" @click="selectCoupon">
      优惠券
      <text style="color:#CCCCCC; margin-left:22rpx;" class="fr iconfont icon-mpmall">&#xe638;</text>
      <span v-if="!couponInfo.couponId && availableCouponList.length" class="fr">{{availableCouponList.length}}张优惠券可用</span>
      <span v-if="!availableCouponList.length" class="fr unavailable">暂无可用</span>
      <span v-if="couponInfo.couponId" class="fr available">{{couponInfo.text}}</span>
    </div>
    <div class="wx-pay panel-item">
      <text class="iconfont icon-mpmall">&#xe685;</text>微信支付
      <icon type="success" class="fr" size="13" color="#fa5f62"/>
    </div>
    <div class="pay-info">
      <p class="total-money">
        总计: <span class="fr">￥{{finalyMoney}}</span>
      </p>
      <p class="freight-money">
        运费: <span class="fr">{{totalFreightMoney}}</span>
      </p>
      <p class="discount-money">
        优惠: <span class="fr">{{couponMoney}}</span>
      </p>
    </div>
    <div class="remark-item panel-item">
      买家留言
      <input type="text" v-model="remark" placeholder="选填:给商家留言">
    </div>
    <div class="pay-btn" @click="toPay">去支付</div>
  </div>
</template>

<script>
import { baseURL, formatPhone, formatDate } from '@/utils/index'
import { getValueByLabel } from '@/assets/json/area'
import { wxLogin } from '@/utils/login'
import store from '@/store/store'
export default {
  components: {
  },
  data () {
    return {
      orderList: [],
      freightArr: [],
      couponList: [],
      availableCouponList: [],
      couponInfo: {
        text: '',
        type: '',
        value: '',
        couponId: ''
      },
      totalFreightMoney: 0,
      productIds: [],
      remark: '',
      receiver: '',
      phone: '',
      formatPhoneStr: '',
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
      timeoutDuration: 500,
      isDisable: false,
      pageIndex: 1,
      pageSize: 100
    }
  },
  methods: {
    selectCoupon() {
      if (this.availableCouponList.length) {
        store.commit('setAvailableCouponList', this.availableCouponList)
        let url = '/pages/selectcoupon/main'
        wx.navigateTo({ url })
      }
    },
    fillBackCoupon() {
      let couponIndex = store.state.currentCouponIndex
      this.couponInfo = {
        text: '',
        type: '',
        value: '',
        couponId: ''
      }
      if (couponIndex || couponIndex === 0) {
        let item = this.availableCouponList[couponIndex]
        this.couponInfo = {
          couponId: item.couponId,
          type: item.type,
          value: item.discountValue
        }
        let text = ''
        if (item.minimumUsablePrice) text = `满${item.minimumUsablePrice}元`
        if (item.type == 'Percent') {
          this.couponInfo.text = text + (item.discountValue * 10) + '折'
        } else {
          this.couponInfo.text = text + '减' + item.discountValue + '元'
        }
      }
    },
    getCouponList() {
      wx.$http({
        url: `${baseURL}/api/marketing/coupon/summarys`,
        data: {
          OrderBy: 'CreateTimeDesc',
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        },
        success: (res) => {
          if (res.statusCode == 401) {
            wxLogin().then(() => {
              this.getCouponList()
            })
            return
          }
          let now = Date.now() + 8 * 60 * 60 * 1000
          let pageDatas = res.data.data.currentPageDatas
          let availableCouponList = []
          this.couponList = pageDatas
          for (let index = 0;index < this.couponList.length;index++) {
            let item = this.couponList[index]
            let expireTime = new Date(item.expiredAt).getTime()
            let usableTime
            if (item.usableTime) {
              usableTime = new Date(item.usableTime).getTime()
            } else {
              usableTime = new Date(item.createTime).getTime()
            }
            if (item.status !== 'Used' && now >= usableTime && now <= expireTime) {
              if (item.minimumUsablePrice <= this.totalMoney || !item.minimumUsablePrice) {
                if (item.disableProducts) {
                  let isInclude = false
                  for (let i = 0;i < this.productIds.length;i++) {
                    if (item.disableProducts.includes(this.productIds[i])) {
                      isInclude = true
                      break
                    }
                  }
                  if (!isInclude) {
                    availableCouponList.push(item)
                  }
                } else if(item.enableProducts) {
                  let isInclude = true
                  for (let i = 0;i < this.productIds.length;i++) {
                    if (!item.enableProducts.includes(this.productIds[i])) {
                      isInclude = false
                      break
                    }
                  }
                  if (isInclude) availableCouponList.push(item)
                } else {
                  // console.log(item)
                  availableCouponList.push(item)
                }
              }
            } else {
            }
          }
          this.availableCouponList = availableCouponList
          
        }
      })
    },
    getOrderStatus(id, num) {
      setTimeout(() => {
        wx.$http({
          url: `${baseURL}/api/Order/${id}`,
          success: (res)=> {
            if (res.data.data.status == 1) {
              setTimeout(() => {
                this.isDisable = false
              }, 500)
              wx.$http({
                url: `${baseURL}/api/wechat/payment/order/${id}`,
                method: 'PUT',
                success: (res) => {
                  wx.hideNavigationBarLoading()
                  if (res.statusCode == 500) {
                    wx.showToast({
                      icon: 'none',
                      title: '服务器异常'
                    })
                    return
                  }
                  if (res.statusCode == 400 && res.data.error.code == 50008) {
                    wx.showToast({
                      icon: 'none',
                      title: '商家尚未申请微信支付'
                    })
                    return
                  }
                  let data = res.data.data
                  this.timeoutDuration = 500
                  // wx.hideLoading()
                  wx.requestPayment({
                    'timeStamp': data.timeStamp,
                    'nonceStr': data.nonceStr,
                    'package': data.package,
                    'signType': data.signType,
                    'paySign': data.paySign,
                    'success': (res) => {
                      wx.navigateTo({
                        url: `/pages/paysuccess/main?orderId=${id}&orderNumber=${num}`
                      })
                    },
                    fail: (res) => {
                      wx.navigateTo({
                        url: `/pages/payfail/main?orderId=${id}&orderNumber=${num}`
                      })
                    }
                  })
                }
              })
            } else if(res.data.data.status == 2){
              let errStatus = res.data.data.errorsOnCreation[0]
              let title
              switch (errStatus) {
                case 0:
                    title = '商品不存在'
                  break;
                case 1:
                    title = 'sku不存在'
                  break;
                case 2:
                    title = '库存不足'
                  break;
                case 3:
                    title = '商品已下架'
                  break;
                case 4:
                    title = '商品不在配送范围内'
                  break;
                case 5:
                    title = '商品跨店铺'
                  break;
                case 6:
                    title = '优惠券已被使用'
                  break;
                case 7:
                    title = ' 优惠券不存在'
                  break;
                case 8:
                    title = ' 优惠券使用条件不满足'
                  break;
                default:
                  break;
              }
              wx.showToast({
                title,
                icon: 'none'
              })
              wx.hideNavigationBarLoading()
              this.isDisable = false
            } else {
              this.timeoutDuration = 100
              this.getOrderStatus(id, num)
            }
          }
        })
      }, this.timeoutDuration)
    },
    toPay() {
      if (!this.address.provinceId) {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none'
        })
        return
      }
      let from = 'Basket'
      if (this.orderList[0].from) {
        from = this.orderList[0].from
      }
      if (!this.isDisable) {
        wx.$http({
          url: `${baseURL}/api/order`,
          method: 'POST',
          data: {
            from,
            items: this.items,
            remark: this.remark,
            address: this.address,
            receiver: this.receiver,
            phone: this.phone,
            couponId: this.couponInfo.couponId
          },
          success: (res) => {
            if (res.statusCode == 401) {
              wxLogin().then(() => {
                this.toPay()
              })
              this.isDisable = false
              return
            }
            let data = res.data.data
            this.timeoutDuration = 500
            // wx.showLoading({
            //   // title: '加载中...'
            // })
            wx.showNavigationBarLoading()
            this.getOrderStatus(data.orderId, data.orderNumber)
          }
        })
      }
      this.isDisable = true
    },
    chooesAddress() {
      wx.getSetting({  
        success: (res) => {  
          if (!res.authSetting['scope.address']) {
            wx.showModal({
              title: '信息授权提示',
              content: '需要访问您的通讯地址,请到小程序的设置中打开通讯地址授权',
              confirmText: '去设置',
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      if (res.authSetting['scope.userInfo']) {
                        this.getAddressInfo()
                      }
                    }
                  })
                }
              }
            })
          } else {
            this.getAddressInfo()
          }
        }
      })
    },
    getAddressInfo() {
      wx.chooseAddress({
        success: (res) => {
          let {provinceValue, cityValue, districtValue} = getValueByLabel(res.provinceName, res.cityName, res.countyName)
          this.receiver = res.userName
          this.phone = res.telNumber
          this.formatPhoneStr = formatPhone(this.phone)
          this.receiver = res.userName
          this.address.provinceId = provinceValue
          this.address.cityId = cityValue
          this.address.areaId = districtValue
          this.address.details = res.detailInfo
          this.provinceName = res.provinceName
          this.cityName = res.cityName
          this.countyName = res.countyName
          this.detailInfo = res.detailInfo
          this.calculationFreight()
        },
        fail: (res) => {
          wx.getSetting({  
            success: (res) => {  
              if (!res.authSetting['scope.address']) {
                wx.showModal({
                  title: '信息授权提示',
                  content: '需要访问您的通讯地址,请到小程序的设置中打开通讯地址授权',
                  confirmText: '去设置',
                  success: (res) => {
                    if (res.confirm) {
                      wx.openSetting({
                        success: (res) => {
                          if (res.authSetting['scope.userInfo']) {
                            this.getAddressInfo()
                          }
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
      })
    },
    calculationFreight() {
      if (this.address.provinceId) {
        let totalFreightMoney = 0
        this.freightArr.forEach((item) => {
          wx.$http({
            url: `${baseURL}/api/product/freight/template/computedprice`,
            data: {
              ProvinceId: this.address.provinceId,
              cityId: this.address.cityId,
              areaId: this.address.areaId,
              TemplateId: item.TemplateId,
              Volume: item.Volume,
              Number: item.Number,
              Weight: item.Weight
            },
            success: (res) => {
              if (res.statusCode == 401) {
                wxLogin().then(() => {
                  this.calculationFreight()
                })
                return
              }
              if (res.data.data !== null) {
                totalFreightMoney += res.data.data
              } else {
                wx.showToast({
                  title: '商品不在配送范围内',
                  icon: 'none'
                })
              }
              this.totalFreightMoney = totalFreightMoney
            }
          })
        })
      }
    }
  },
  computed: {
    totalMoney() {
      let money = 0
      this.orderList.forEach((item) => {
        money += parseFloat(item.sku.price) * item.count
      })
      return money
    },
    couponMoney() {
      let money = 0
      if (this.couponInfo.type == 'Percent') {
        money = (1 - this.couponInfo.value) * this.totalMoney
      } else if (this.couponInfo.type == 'Constant') {
        money = this.couponInfo.value
      }
      return money.toFixed(2)
    },
    finalyMoney() {
      let finalyMoney = (this.totalMoney - this.couponMoney + this.totalFreightMoney).toFixed(2)
      return finalyMoney > 0 ? finalyMoney : 0
    },
    items() {
      return this.orderList.map((item) => {
        return {
          skuId: item.sku.skuId,
          productId: item.productId,
          count: item.count
        }
      })
    }
  },
  onShow() {
    this.fillBackCoupon()
  },
  onUnload() {
    store.commit('setCurrentCouponIndex', '')
  },
  mounted() {
    // console.log(store.state.orderList)
    // this.orderList = wx.getStorageSync('orderList') ? JSON.parse(wx.getStorageSync('orderList')) : []
    this.remark = ''
    this.orderList = store.state.orderList
    this.getCouponList()
    this.productIds = this.orderList.map(item => item.productId)
    let arr = this.orderList
    let map = {},
      freightArr = [];
    for (let i = 0; i < arr.length; i++) {
      let ai = arr[i]
      if (!map[ai.freightTemplateId]) {
        freightArr.push({
          TemplateId: ai.freightTemplateId,
          Volume: ai.sku.volume * ai.count,
          Weight: ai.sku.weight * ai.count,
          Number: ai.count
        })
        map[ai.freightTemplateId] = ai
      } else {
        for (let j = 0; j < freightArr.length; j++) {
          let dj = freightArr[j]
          if (dj.TemplateId == ai.freightTemplateId) {
            dj.Volume += ai.sku.volume * ai.count
            dj.Weight += ai.sku.weight * ai.count
            dj.Number += ai.count
            break;
          }
        }
      }
    }
    this.freightArr = freightArr
    this.calculationFreight()
  }
}
</script>

<style lang="scss">
.enter-order{
  background: #f5f5f5;
  padding-bottom: 98rpx;
  min-height:100%;
  box-sizing:border-box;
  .pay-info{
    background: #fff;
    box-sizing: border-box;
    padding: 32rpx;
    font-size: 26rpx;
    .total-money{
      font-size: 30rpx;
      color: #353535;
      margin-bottom: 24rpx;
      .fr{
        color: #fa5f62;
      }
    }
    .freight-money{
      font-size: 26rpx;
      color: #888888;
      margin-bottom: 24rpx;
    }
    .discount-money{
      font-size: 26rpx;
      color: #888888;
    }
  }
  .panel-item{
    line-height: 90rpx;
    background: #fff;
    box-sizing: border-box;
    padding: 0 32rpx;
    margin-top: 24rpx;
    font-size: 26rpx;
    .unavailable{
      color: #CCCCCC;
    }
    .available{
      color: #FA5F62;
    }
  }
  .remark-item{
    font-size:30rpx;
    padding-bottom: 20rpx; 
    input{
      display:block;
      color:#666666;
      position: relative;
      z-index: 0;
      // top: 15rpx;
      // left: 8rpx;
      font-size: 26rpx;
    }
  }
  .wx-pay{
    border-bottom: 1rpx solid #f0f0f0;
    .iconfont{
      color: #30bf13;
      margin-right: 16rpx;
    }
    .fr{
      margin-top: 10rpx;
    }
  }
  .pay-btn{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    line-height: 98rpx;
    text-align: center;
    color: #fff;
    background: #fa5f62;
    font-size: 36rpx;
  }
  .choose-address{
    position: relative;
    height: 104rpx;
    background: #fff;
    margin-bottom: 24rpx;
    .select-address{
      line-height: 104rpx;
      font-size: 28rpx;
      color: #333;
      .icon-mpmall{
        color: #888888;
        font-size: 36rpx;
        margin: 0 24rpx;
      }
      .fr{
        color: #ccc;
      }
    }
    .address-line{
      position: absolute;
      bottom: 0;
      left: 0;
      height: 4rpx;
      width: 100%;
      background: url('../../assets/img/address-line.png') repeat-x;
    }
  }
  .has-address{
    height: 150rpx;
    box-sizing: border-box;
    padding-left: 32rpx;
    padding-top: 32rpx; 
    .selected-address{
      color: #333333;
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
      }
      .fr{
        position: absolute;
        top: 55rpx;
        right: 24rpx;
        color: #cccccc;
      }
    }
  }
  .order-container{
    width: 100%;
    overflow-x: hidden;
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
            width: 95%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 24rpx;
            color: #353535;
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
