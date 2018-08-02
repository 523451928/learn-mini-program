<template>
  <div class="coupon-container">
    <div class="coupon-list">
      <ul v-if="couponList.length">
        <li v-for="(coupon, index) in sortedCouponList" :key="index" class="clearfix" :class="{'expired-coupon': coupon.isExpire, 'used-coupon': coupon.status == 'Used'}">
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
            <div class="text" @click="toUse(coupon)">
               &nbsp;&nbsp;&nbsp;{{coupon.statusText}}
            </div>
          </div>
        </li>
      </ul>
      <div class="empty-coupon" v-else>
        <img src="../../assets/img/no-coupon.png" alt="">
        <p>暂无优惠券可用</p>
      </div>
      <mp-loading v-if="!isAllLoaded && couponList.length" :loadVisible="isLoadmore"></mp-loading>
    </div>
  </div>
</template>

<script>
import { baseURL, formatDate } from '../../utils'
import { wxLogin } from '@/utils/login'
import MpLoading from '@/components/public/MpLoading'
export default {
  components: {
    MpLoading
  },
  data () {
    return {
      couponList: [],
      isLoadmore: false,
      isAllLoaded: false,
      pageIndex: 1,
      pageSize: 20
    }
  },
  methods: {
    toUse(coupon) {
      if (coupon.statusText == '去使用') {
        let url
        if (coupon.enableProducts) {
          url = `/pages/goodslist/main?enableProducts=${coupon.enableProducts}&groupName=可用商品`
        } else if (coupon.disableProducts) {
          url = `/pages/goodslist/main?disableProducts=${coupon.disableProducts}&groupName=全部商品`
        } else {
          url = '/pages/goodslist/main?groupName=全部商品'
        }
        console.log(url)
        wx.navigateTo({ url })
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
          let now = Date.now()
          let pageDatas = res.data.data.currentPageDatas
          this.couponList = this.couponList.concat(pageDatas)
          this.couponList.forEach((item) => {
            let expireTime = new Date(item.expiredAt).getTime()
            let dateRange
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
            if (item.status == 'Used') {
              this.$set(item, 'statusText', '已使用')
            } else {
              this.$set(item, 'statusText', '去使用')
            }
            if (item.disableProducts) {
              this.$set(item, 'availableRange', '指定商品不可用')
            } else if(item.enableProducts) {
              this.$set(item, 'availableRange', '指定商品可用')
            } else {
              this.$set(item, 'availableRange', '全部商品可用')
            }
            if (now > expireTime) {
              this.$set(item, 'isExpire', true)
              this.$set(item, 'statusText', '已过期')
            }
          })
          if (pageDatas.length < this.pageSize) {
            this.isAllLoaded = true
            this.isLoadmore = false
          }
        }
      })
    }
  },
  computed: {
    sortedCouponList() {
      let invalidList = this.couponList.filter(item => item.status == 'Used' || item.isExpire)
      let validList = this.couponList.filter(item => item.status != 'Used' && !item.isExpire)
      return validList.concat(invalidList)
    }
  },
  mounted() {
    this.isAllLoaded = false
    this.couponList = []
    this.pageIndex = 1
    this.getCouponList()
  },
  onReachBottom() {
    this.pageIndex++
    if (!this.isAllLoaded) {
      this.isLoadmore = true
      this.getCouponList()
    }
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
    .empty-coupon{
      padding-top: 150rpx;
      text-align: center;
      font-size: 28rpx;
      color: #B3B3B3;
      img{
        width: 180rpx;
        height: 180rpx;
        margin-bottom: 120rpx;
      }
    }
    li{
      width: 100%;
      height: 180rpx;
      margin-bottom: 21rpx;
      background: url('../../assets/img/coupons-available.png');
      background-size: cover;
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
    .expired-coupon{
      background: url('../../assets/img/coupons-expired.png');
      background-size: cover;
      .status-text{
        color: #ccc;
      }
    }
    .used-coupon{
      background: url('../../assets/img/coupons-used.png');
      background-size: cover;
      .status-text{
        color: #ccc;
      }
    }
  }
}
</style>
