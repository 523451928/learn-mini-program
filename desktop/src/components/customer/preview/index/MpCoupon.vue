<template>
  <div class="coupon-container">
    <div class="coupon-list" :class="{'coupon-list-a': couponList.length <= 2}">
      <div class="scroll-view" scroll-x >
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
        <ul class="single-list clearfix" v-if="!couponList.length">
          <li>
            <div class="coupon-info">
              <div class="left-box">
                <p class="discount-text">
                  <span>￥</span>0
                </p>
              </div>
              <div class="right-box">
                <p class="coupon-text">优惠券</p>
                <p class="limited-text">满0元可用</p>
              </div>
            </div>
            <div class="receive-btn">
              <div>
                <p>立 即</p>
                <p>领 取</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { removeRepeat } from '@/assets/js/utils'
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
      this.$toast('领取成功')
      let couponList = localStorage.getItem('couponList') ? JSON.parse(localStorage.getItem('couponList')) : []
      couponList.unshift(couponContainerId)
      couponList = removeRepeat(couponList)
      localStorage.setItem('couponList', JSON.stringify(couponList))
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
    font-size: 14px;
    height: 2.26rem;
    overflow: hidden;
    .coupon-list{
      padding: .32rem 0 .32rem .32rem;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      ::-webkit-scrollbar {
        display: none;
      }
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
                font-size: .64rem;
                margin-top: .48rem;
              }
            }
            .right-box{
              width: 60%;
              color: #666666;
              text-align: left;
              .limited-text{
                position: relative;
                top: .16rem;
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
            width: .28rem;
            height: .28rem;
            border-radius: 50%;
            background: #F7F7F7;
            top: -.14rem;
            left: 72%;
          }
          &::before{
            content: '';
            position: absolute;
            display: inline-block;
            width: .28rem;
            height: .28rem;
            border-radius: 50%;
            background: #F7F7F7;
            bottom: -.14rem;
            left: 72%;
          }
          .receive-btn{
            p{
              font-size: .36rem;
              text-align: center;
              margin: .26rem 0 .1rem 0;
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
            margin-right: 0rem;
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
            width: .28rem;
            height: .28rem;
            border-radius: 50%;
            background: #F7F7F7;
            top: -.14rem;
            left: 71%;
          }
          &::before{
            content: '';
            position: absolute;
            display: inline-block;
            width: .28rem;
            height: .28rem;
            border-radius: 50%;
            background: #F7F7F7;
            bottom: -.14rem;
            left: 71%;
          }
        }
      }
      li {
        position: relative;
        display: inline-block;
        box-sizing: border-box;
        width: 2.80rem;
        height: 1.62rem;
        margin-right: .24rem;
        border-radius: .04rem;
        background: #fff;
        overflow: hidden;
        &::after{
          content: '';
          position: absolute;
          display: inline-block;
          width: .28rem;
          height: .28rem;
          border-radius: 50%;
          background: #F7F7F7;
          top: -.14rem;
          left: 1.95rem;
        }
        &::before{
          content: '';
          position: absolute;
          display: inline-block;
          width: .28rem;
          height: .28rem;
          border-radius: 50%;
          background: #F7F7F7;
          bottom: -.14rem;
          left: 1.95rem;
        }
        .coupon-info{
          display: inline-block;
          width: 2.00rem;
          height: 1.62rem;
          text-align: center;
          background: #fff;
          .discount-text{
            font-size: .46rem;
            color: #FA5F62;
            margin: .34rem 0 .24rem 0;
            font-weight: bold;
            span{
              font-weight: normal;
              font-size: .30rem;
            }
          }
          .limited-text{
            font-size: .28rem;
            color: #999999;
          }
        }
        .receive-btn{
          display: inline-block;
          vertical-align: top;
          background: #fff;
          font-size: .24rem;
          color: #FA5F62;
          height: 1.62rem;
          width: .78rem;
          border-left: 1px dashed #EDEDED;
          .text{
            width: .24rem;
            margin: 0 auto; 
            height: 100%;
            white-space: break-word;
            writing-mode:vertical-rl;
          }
        }
      }
    }
    .coupon-list-a{
      padding: .32rem;
    }
  }
</style>