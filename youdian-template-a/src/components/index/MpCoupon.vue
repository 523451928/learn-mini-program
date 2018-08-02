<template>
  <div class="coupon-container">
    <div class="coupon-list" :class="{'coupon-list-a': couponList.length <= 2}">
      <scroll-view class="scroll-view" scroll-x >
        <ul class="clearfix" v-if="couponList.length >= 3">
          <li v-for="coupon in couponList" :key="coupon.couponContainerId">
            <div class="coupon-info">
              <p class="discount-text">
                {{coupon.discountText}}<span>{{coupon.type == 'Constant' ? '元' : '折'}}</span>
              </p>
              <p class="limited-text">{{coupon.limitedText}}</p>
            </div>
            <div class="receive-btn" @click="receiveCoupon(coupon.couponContainerId)">
              <div class="text">
                &nbsp; &nbsp; 立即领取
              </div>
            </div>
          </li>
        </ul>
        <ul class="double-list clearfix" v-if="couponList.length == 2">
          <li v-for="coupon in couponList" :key="coupon.couponContainerId">
            <div class="coupon-info">
              <p class="discount-text">
                {{coupon.discountText}}<span>{{coupon.type == 'Constant' ? '元' : '折'}}</span>
              </p>
              <p class="limited-text">{{coupon.limitedText}}</p>
            </div>
            <div class="receive-btn" @click="receiveCoupon(coupon.couponContainerId)">
              <div class="text">
                &nbsp; &nbsp; 立即领取
              </div>
            </div>
          </li>
        </ul>
        <ul class="single-list clearfix" v-if="couponList.length == 1">
          <li v-for="coupon in couponList" :key="coupon.couponContainerId">
            <div class="coupon-info">
              <div class="left-box">
                <p class="discount-text">
                  <span v-if="coupon.type == 'Constant'">￥</span> {{coupon.discountText}}<span>{{coupon.type !== 'Constant' ? '折' : ''}}</span>
                </p>
              </div>
              <div class="right-box">
                <p>优惠券</p>
                <p class="limited-text">{{coupon.limitedText}}</p>
              </div>
            </div>
            <div class="receive-btn" @click="receiveCoupon(coupon.couponContainerId)">
              <div>
                <p>立 即</p>
                <p>领 取</p>
              </div>
            </div>
          </li>
        </ul>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import { baseURL } from '@/utils/index'
export default {
  props: {
    couponList: {
      type: Array,
      default() {
        return []
      }
    } 
  },
  data() {
    return {
      // couponList: []
    }
  },
  components: {
    
  },
  methods: {
    receiveCoupon(couponContainerId) {
      wx.$http({
        method: 'PUT',
        url: `${baseURL}/api/marketing/coupon/container`,
        data: {
          couponContainerId
        },
        success: (res) => {
          console.log(res.data)
          if (res.data.error) {
            wx.showToast({
              title: '领取失败，优惠券已领完',
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '领取成功',
              icon: 'none'
            })
          }
        }
      })
    },
    getList(list) {
      let couponList = []
      let promise = Promise.resolve(couponList)
      list.forEach(item => {
        promise = promise.then(() => {
          return new Promise((resolve => {
            wx.request({
              url: `${baseURL}/api/marketing/coupon/container/${item}`,
              success: (res) => {
                let data = res.data.data
                if (data.type == 'Constant') {
                  this.$set(data, 'discountText', `${data.value}`)
                } else {
                  this.$set(data, 'discountText', `${data.value * 10}`)
                }
                if (data.minimumOrderPrice) {
                  this.$set(data, 'limitedText', `满${data.minimumOrderPrice}元可用`)
                } else {
                  this.$set(data, 'limitedText', '不限')
                }
                couponList.push(data)
                resolve()
              }
            })
          }))
        })
      })
      this.couponList= couponList
      return promise
    },
  },
  mounted() {
    
  }
}
</script>

<style lang="scss">
  .coupon-container{
    height: 226rpx;
    // .scroll-view{
    //   overflow: hidden;
    // }
    .coupon-list{
      padding: 32rpx 0 32rpx 32rpx;
      box-sizing: border-box;
      background: #F7F7F7;
      white-space: nowrap;
      .single-list{
        li{
          width: 100%;
          margin: 0;
          .coupon-info{
            width: 73%;
            div{
              display: inline-block;
            }
            .left-box{
              width: 40%;
              .discount-text{
                font-size: 64rpx;
                margin-top: 48rpx;
              }
            }
            .right-box{
              width: 60%;
              color: #666666;
              text-align: left;
              .limited-text{
                position: relative;
                top: 16rpx;
              }
            }
          }
          .receive-btn{
            width: 27%;
          }
          &::after{
            content: '';
            position: absolute;
            display: inline-block;
            width: 28rpx;
            height: 28rpx;
            border-radius: 50%;
            background: #F7F7F7;
            top: -14rpx;
            left: 71%;
          }
          &::before{
            content: '';
            position: absolute;
            display: inline-block;
            width: 28rpx;
            height: 28rpx;
            border-radius: 50%;
            background: #F7F7F7;
            bottom: -14rpx;
            left: 71%;
          }
          .receive-btn{
            p{
              font-size: 36rpx;
              text-align: center;
              margin: 38rpx 0 14rpx 0;
              &:last-child{
                margin: 0;
              }
            }
          }
        }
      }
      .double-list{
        li {
          width: 49%;
          margin-right: 2%;
          &:last-child{
            margin-right: 0rpx;
          }
          .coupon-info{
            width: 73%;
          }
          .receive-btn{
            width: 27%;
          }
          &::after{
            content: '';
            position: absolute;
            display: inline-block;
            width: 28rpx;
            height: 28rpx;
            border-radius: 50%;
            background: #F7F7F7;
            top: -14rpx;
            left: 69%;
          }
          &::before{
            content: '';
            position: absolute;
            display: inline-block;
            width: 28rpx;
            height: 28rpx;
            border-radius: 50%;
            background: #F7F7F7;
            bottom: -14rpx;
            left: 69%;
          }
        }
      }
      li {
        position: relative;
        display: inline-block;
        box-sizing: border-box;
        width: 280rpx;
        height: 162rpx;
        margin-right: 24rpx;
        border-radius: 4rpx;
        overflow: hidden;
        &::after{
          content: '';
          position: absolute;
          display: inline-block;
          width: 28rpx;
          height: 28rpx;
          border-radius: 50%;
          background: #F7F7F7;
          top: -14rpx;
          left: 186rpx;
        }
        &::before{
          content: '';
          position: absolute;
          display: inline-block;
          width: 28rpx;
          height: 28rpx;
          border-radius: 50%;
          background: #F7F7F7;
          bottom: -14rpx;
          left: 186rpx;
        }
        .coupon-info{
          display: inline-block;
          width: 200rpx;
          height: 162rpx;
          text-align: center;
          background: #fff;
          .discount-text{
            font-size: 46rpx;
            color: #FA5F62;
            margin: 34rpx 0 24rpx 0;
            font-weight: bold;
            span{
              font-weight: normal;
              font-size: 30rpx;
            }
          }
          .limited-text{
            font-size: 28rpx;
            color: #999999;
          }
        }
        .receive-btn{
          display: inline-block;
          vertical-align: top;
          background: #fff;
          font-size: 24rpx;
          color: #FA5F62;
          height: 162rpx;
          width: 78rpx;
          border-left: 2rpx dashed #EDEDED;
          .text{
            width: 24rpx;
            margin: 0 auto; 
            height: 100%;
            white-space: break-word;
            writing-mode:vertical-rl;
          }
        }
      }
    }
    .coupon-list-a{
      padding: 32rpx;
    }
  }
</style>