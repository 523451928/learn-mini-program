<template>
  <div class="coupon-content">
    <div class="coupon-list">
      <ul v-if="couponList.length">
        <li v-for="(coupon, index) in couponList" :key="index" class="clearfix" :class="{'expired-coupon': coupon.isExpire, 'used-coupon': coupon.status == 'Used'}">
          <div class="coupon-value">
            <p style="margin-top:.12rem;margin-bottom: .08rem;">
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
          <div class="status-text" @click="toUse(coupon)">
            <div class="text">
               &nbsp;&nbsp;&nbsp;{{coupon.statusText}}
            </div>
          </div>
        </li>
      </ul>
      <div class="empty-coupon" v-else>
        <img src="../../../../assets/imgs/no-coupon.png" alt="">
        <p>暂无优惠券可用</p>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/filters/filters'
export default {
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
        let path
        if (coupon.enableProducts) {
          path = `/goodslist?enableProducts=${coupon.enableProducts}&groupName=可用商品`
        } else if (coupon.disableProducts) {
          path = `/goodslist?disableProducts=${coupon.disableProducts}&groupName=全部商品`
        } else {
          path = '/goodslist?groupName=全部商品'
        }
        this.$router.push({
          path
        })
      }
    },
     getList(list) {
      let couponList = []
      let promise = Promise.resolve()
      let now = Date.now()
      list.forEach(id => {
        promise = promise.then(() => {
          return new Promise((resolve => {
            this.$http.get(`/api/marketing/coupon/container/${id}`).then((res) => {
              let item = res.data.data
              let expireTime = new Date(item.expiredAt).getTime()
              let dateRange
              if (item.rangeExpired) {
                dateRange = formatDate(item.rangeExpired.start, '.', true) + '--' + formatDate(item.rangeExpired.end, '.', true) 
              } else {
                let expiredAt = new Date(now + item.relativeExpiredMilliseconds)
                dateRange = formatDate(item.createTime, '.', true) + '--' + formatDate(expiredAt, '.', true) 
              }
              this.$set(item, 'dateRange', dateRange)
              if (item.type == 'Percent') {
                this.$set(item, 'typeText', '折扣券')
                this.$set(item, 'valueText', item.value * 10)
              } else {
                this.$set(item, 'typeText', '代金券')
                this.$set(item, 'valueText', item.value)
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
              if (item.disableProducts.length) {
                this.$set(item, 'availableRange', '指定商品不可用')
              } else if(item.enableProducts.length) {
                this.$set(item, 'availableRange', '指定商品可用')
              } else {
                this.$set(item, 'availableRange', '全部商品可用')
              }
              if (now > expireTime) {
                this.$set(item, 'isExpire', true)
                this.$set(item, 'statusText', '已过期')
              }
              couponList.push(item)
              resolve(couponList)
            })
          }))
        })
      })
      this.couponList= couponList
      return promise
    }
  },
  mounted() {
    this.isAllLoaded = false
    this.couponList = []
    this.pageIndex = 1
    document.body.style.background = '#F7F7F7'
    let couponIds = JSON.parse(localStorage.getItem('couponList')) || []
    this.getList(couponIds).then((res) => {
      console.log(res)
    })
  }
}
</script>

<style lang="scss">
.coupon-content{
  padding: .20rem .32rem;
  min-height: 100%;
  box-sizing: border-box;
  background: #F7F7F7;
  font-size: 14px;
  .coupon-list{
    .empty-coupon{
      padding-top: 1.50rem;
      text-align: center;
      font-size: .28rem;
      color: #B3B3B3;
      img{
        width: 1.80rem;
        height: 1.80rem;
        margin-bottom: 1.20rem;
      }
    }
    li{
      width: 100%;
      height: 1.80rem;
      margin-bottom: .21rem;
      background: url('../../../../assets/imgs/coupons-available.png');
      background-size: cover;
      position: relative;
      overflow: hidden;
      .coupon-value{
        float: left;
        width: 2.00rem;
        text-align: center;
        color: #fff;
        .value-text{
          font-size: .84rem;
        }
        .type-text{
          font-size: .30rem;
        }
      }
      .coupon-info{
        float: left;
        width: 3.90rem;
        box-sizing: border-box;
        color: #CCCCCC;
        font-size: .24rem;
        padding: .3rem 0 0 .56rem;
        p{
          margin-bottom: .12rem;
        }
        .limited-text{
          font-size: .2rem;
          color: #666666;
          margin-bottom: .24rem;
        }
      }
      .status-text{
        float: right;
        width: .94rem;
        color: #FA5F62;
        letter-spacing: .05rem;
        .text{
          width: .28rem;
          font-size: .28rem;
          margin: 0 auto; 
          height: 100%;
          white-space: break-word;
          writing-mode:vertical-rl;
        }
      }
    }
    .expired-coupon{
      background: url('../../../../assets/imgs/coupons-expired.png');
      background-size: cover;
      .status-text{
        color: #ccc;
      }
    }
    .used-coupon{
      background: url('../../../../assets/imgs/coupons-used.png');
      background-size: cover;
    }
  }
}
</style>
