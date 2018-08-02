<template>
  <div class="coupon-container">
    <div class="coupon-list">
      <ul>
        <li v-for="(coupon, index) in couponList" @click="toUse(index)" :key="index" class="clearfix" :class="{'selected-coupon': coupon.selected, 'used-coupon': coupon.status == 'Used'}">
          <div class="coupon-value">
            <p style="margin-top:24rpx;margin-bottom: 20rpx;">
              <span v-if="coupon.type != 'Percent'">￥</span>
              <span class="value-text">{{coupon.valueText}}</span>
              <span v-if="coupon.type == 'Percent'">折</span>
            </p>
            <p class="type-text">{{coupon.typeText}}</p>
          </div>
          <div class="coupon-info">
            <p class="limited-text">{{coupon.limitedText}}</p>
            <p class="available-range">{{coupon.availableRange}}</p>
            <p class="date-range">{{coupon.dateRange}}</p>
          </div>
          <div class="status-text">
            <div class="text" v-if="coupon.selected" >
               &nbsp;&nbsp;&nbsp;使用中
            </div>
          </div>
        </li>
      </ul>
      <div class="no-use-btn" @click="noUseCoupon">
        不使用优惠券
      </div>
    </div>
  </div>
</template>

<script>
import { baseURL, formatDate } from '../../utils'
import store from '@/store/store'
export default {
  components: {
  },
  data () {
    return {
      couponList: []
    }
  },
  methods: {
    toUse(index) {
      store.commit('setCurrentCouponIndex', index)
      wx.navigateBack()
    },
    noUseCoupon() {
      store.commit('setCurrentCouponIndex', '')
      wx.navigateBack()
    }
  },
  onShow() {
    let couponIndex = store.state.currentCouponIndex
    this.couponList = store.state.availableCouponList
    this.couponList.forEach((item, index) => {
      let expireTime = new Date(item.expiredAt).getTime()
      let dateRange
      if (index === couponIndex) {
        this.$set(item, 'selected', true)
      } else {
        this.$set(item, 'selected', false)
      }
      if (item.usableTime) {
        dateRange = formatDate(item.usableTime, '.', true) + '--' + formatDate(item.expiredAt, '.', true) 
      } else {
        dateRange = formatDate(item.createTime, '.', true) + '--' + formatDate(item.expiredAt, '.', true) 
      }
      this.$set(item, 'dateRange', dateRange)
      if (item.type == 'Percent') {
        this.$set(item, 'typeText', '折扣券')
        this.$set(item, 'valueText', item.discountValue * 10)
      } else {
        this.$set(item, 'typeText', '代金券')
        this.$set(item, 'valueText', item.discountValue)
      }
      if (item.minimumUsablePrice) {
        this.$set(item, 'limitedText', `满${item.minimumUsablePrice}元可用`)
      } else {
        this.$set(item, 'limitedText', '无限制门槛')
      }
      if (item.disableProducts) {
        this.$set(item, 'availableRange', '指定商品不可用')
      } else if(item.enableProducts) {
        this.$set(item, 'availableRange', '指定商品可用')
      } else {
        this.$set(item, 'availableRange', '全部商品可用')
      }
    })
  }
}
</script>

<style lang="scss">
.coupon-container{
  padding: 20rpx 32rpx;
  min-height: 100%;
  box-sizing: border-box;
  background: #F7F7F7;
  .coupon-list{
    .no-use-btn{
      width: 100%;
      line-height: 90rpx;
      text-align: center;
      background: #fff;
      border-radius: 10rpx;
      color: #333333;
      font-size: 32rpx;
      margin: 100rpx 0;
    }
    li{
      width: 100%;
      height: 181rpx;
      margin-bottom: 21rpx;
      background: url('../../assets/img/coupons-noborder.png') no-repeat;
      // background-size: cover;
      background-size: contain;
      position: relative;
      .coupon-value{
        float: left;
        width: 200rpx;
        text-align: center;
        color: #fff;
        .value-text{
          font-size: 84rpx;
        }
        .type-text{
          font-size: 30rpx;
        }
      }
      .coupon-info{
        float: left;
        width: 390rpx;
        box-sizing: border-box;
        color: #CCCCCC;
        font-size: 24rpx;
        padding: 34rpx 0 0 56rpx;
        p{
          margin-bottom: 15rpx;
        }
        .limited-text{
          font-size: 28rpx;
          color: #666666;
          margin-bottom: 34rpx;
        }
      }
      .status-text{
        float: right;
        width: 94rpx;
        color: #FA5F62;
        letter-spacing: 5rpx;
        .text{
          width: 28rpx;
          font-size: 28rpx;
          margin: 0 auto; 
          height: 100%;
          white-space: break-word;
          writing-mode:vertical-rl;
        }
      }
    }
    .selected-coupon{
      background: url('../../assets/img/coupons-selected.png') no-repeat;
      background-size: contain;
    }
  }
}
</style>
