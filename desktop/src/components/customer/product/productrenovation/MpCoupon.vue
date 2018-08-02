<template>
  <div class="mp-coupon" @click="changeComponent">
    <el-popover
      placement="top"
      width="170"
      v-model="popVisible">
      <p style="text-align: center; margin-top: 10px">确定删除优惠券组件吗？</p>
      <div style="text-align: center; margin: 10px">
        <el-button size="mini" round @click="popVisible = false">取消</el-button>
        <el-button round type="primary" size="mini" @click="deleteComponent">确定</el-button>
      </div>
      <span slot="reference" class="delete-btn">
        <span class="el-icon-delete"></span>删除
      </span>
    </el-popover>
    <div>
      <div class="coupon-container">
        <div class="coupon-list" :class="{'coupon-list-a': couponIds.length <= 2}">
          <div class="scroll-view" scroll-x >
            <ul class="clearfix multiple-list" v-if="couponIds.length >= 3">
              <li v-for="coupon in formatCouponList" :key="coupon.couponContainerId">
                <div class="coupon-info">
                  <p class="discount-text">
                    {{coupon.discountText}}<span>{{coupon.type == 'Constant' ? '元' : '折'}}</span>
                  </p>
                  <p class="limited-text">{{coupon.limitedText}}</p>
                </div>
                <div class="receive-btn">
                  <div class="text">
                    &nbsp;立即领取
                  </div>
                </div>
              </li>
            </ul>
            <ul class="double-list clearfix" v-if="couponIds.length == 2">
              <li v-for="coupon in formatCouponList" :key="coupon.couponContainerId">
                <div class="coupon-info">
                  <p class="discount-text">
                    {{coupon.discountText}}<span>{{coupon.type == 'Constant' ? '元' : '折'}}</span>
                  </p>
                  <p class="limited-text">{{coupon.limitedText}}</p>
                </div>
                <div class="receive-btn">
                  <div class="text">
                    &nbsp;立即领取
                  </div>
                </div>
              </li>
            </ul>
            <ul class="single-list clearfix" v-if="couponIds.length == 1">
              <li v-for="coupon in formatCouponList" :key="coupon.couponContainerId">
                <div class="coupon-info">
                  <div class="left-box">
                    <p class="discount-text">
                      <span v-if="coupon.type == 'Constant'">￥</span> {{coupon.discountText}}<span>{{coupon.type !== 'Constant' ? '折' : ''}}</span>
                    </p>
                  </div>
                  <div class="right-box">
                    <p class="coupon-text">优惠券</p>
                    <p class="limited-text">{{coupon.limitedText}}</p>
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
            <ul class="single-list clearfix" v-if="!couponIds.length">
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
    </div>
  </div>
</template>

<script>
import { mixins } from './mixins'
export default {
  mixins: [ mixins ],
  props: {
    couponList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    
  },
  data() {
    return {
      newestCouponList: [],
      popVisible: false
    }
  },
  methods: {
    getList(list) {
      let couponList = []
      let promise = Promise.resolve(couponList)
      list.forEach(item => {
        promise = promise.then(() => {
          return new Promise((resolve => {
            this.$http.get(`api/marketing/coupon/container/${item}`).then((res) => {
              couponList.push(res.data.data)
              resolve()
            })
          }))
        })
      })
      this.newestCouponList= couponList
      return promise
    }
  },
  computed: {
    couponIds() {
      return this.couponList.map(item => item.couponContainerId)
    },
    formatCouponList() {
      let couponList = this.couponList
      couponList.forEach((item) => {
        if (item.type == 'Constant') {
          this.$set(item, 'discountText', `${item.value}`)
        } else {
          this.$set(item, 'discountText', `${item.value * 10}`)
        }
        if (item.minimumOrderPrice) {
          this.$set(item, 'limitedText', `满${item.minimumOrderPrice}元可用`)
        } else {
          this.$set(item, 'limitedText', '不限')
        }
      })
      return couponList
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/assets/css/mixin.scss';
  .mp-coupon{
    position: relative;
    box-sizing: border-box;
    .delete-btn{
      display: inline-block;
      position: absolute;
      cursor: pointer;
      padding: 3px 8px;
      right: 7px;
      top: 7px;
      z-index: 1000;
      display: none;
      color: #fff;
      font-size: 12px;
      border-radius: 12px;
      background: rgba(0,0,0,0.6);
    }
    &:hover{
      .delete-btn{
        display: inline-block;
      }
      border: 1px dashed #6d6d6d;
    }
     .coupon-container{
      height: 226px * 0.35;
      box-sizing: border-box;
      .coupon-list{
        padding: 26px * 0.35 0 5px 26px * 0.35;
        box-sizing: border-box;
        background: #F7F7F7;
        white-space: nowrap;
        .multiple-list{
          overflow-x: auto;
          @include scrollBar;
        }
        .single-list{
          li{
            width: 100%;
            background: #fff;
            margin: 0;
            .coupon-info{
              width: 71%;
              div{
                display: inline-block;
              }
              .left-box{
                width: 34%;
                .discount-text{
                  font-size: 64px * 0.35;
                  margin-top: 48px * 0.35;
                }
              }
              .right-box{
                width: 60%;
                color: #666666;
                text-align: left;
                .coupon-text{
                  font-size: 15px;
                  position: relative;
                  top: 4px;
                }
                .limited-text{
                  position: relative;
                  top: 20px * 0.35;
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
              width: 28px * 0.35;
              height: 28px * 0.35;
              border-radius: 50%;
              background: #F7F7F7;
              top: -14px * 0.35;
              left: 71%;
            }
            &::before{
              content: '';
              position: absolute;
              display: inline-block;
              width: 28px * 0.35;
              height: 28px * 0.35;
              border-radius: 50%;
              background: #F7F7F7;
              bottom: -14px * 0.35;
              left: 71%;
            }
            .receive-btn{
              p{
                font-size: 36px * 0.35;
                text-align: center;
                margin: 11px 0 14px * 0.35 0;
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
            background: #fff;
            &:last-child{
              margin-right: 0px * 0.35;
            }
            .coupon-info{
              width: 70%;
            }
            .receive-btn{
              width: 27%;
              .text{
                margin-left: 14px;
              }
            }
            &::after{
              content: '';
              position: absolute;
              display: inline-block;
              width: 28px * 0.35;
              height: 28px * 0.35;
              border-radius: 50%;
              background: #F7F7F7;
              top: -14px * 0.35;
              left: 69%;
            }
            &::before{
              content: '';
              position: absolute;
              display: inline-block;
              width: 28px * 0.35;
              height: 28px * 0.35;
              border-radius: 50%;
              background: #F7F7F7;
              bottom: -14px * 0.35;
              left: 69%;
            }
          }
        }
        li {
          position: relative;
          display: inline-block;
          box-sizing: border-box;
          background: #fff;
          width: 280px * 0.35;
          height: 162px * 0.35;
          margin-right: 24px * 0.35;
          border-radius: 4px * 0.35;
          overflow: hidden;
          &::after{
            content: '';
            position: absolute;
            display: inline-block;
            width: 28px * 0.35;
            height: 28px * 0.35;
            border-radius: 50%;
            background: #F7F7F7;
            top: -14px * 0.35;
            left: 70px;
          }
          &::before{
            content: '';
            position: absolute;
            display: inline-block;
            width: 28px * 0.35;
            height: 28px * 0.35;
            border-radius: 50%;
            background: #F7F7F7;
            bottom: -14px * 0.35;
            left: 70px;
          }
          .coupon-info{
            display: inline-block;
            width: 200px * 0.35;
            height: 162px * 0.35;
            text-align: center;
            background: #fff;
            .discount-text{
              font-size: 46px * 0.35;
              color: #FA5F62;
              margin: 34px * 0.35 0 14px * 0.35 0;
              font-weight: bold;
              span{
                font-weight: normal;
                font-size: 30px * 0.35;
              }
            }
            .limited-text{
              font-size: 28px * 0.35;
              color: #999999;
            }
          }
          .receive-btn{
            display: inline-block;
            vertical-align: top;
            background: #fff;
            font-size: 24px * 0.35;
            color: #FA5F62;
            height: 162px * 0.35;
            width: 78px * 0.35;
            border-left: 1px dashed #EDEDED;
            .text{
              width: 24px * 0.35;
              margin: 0 auto; 
              height: 100%;
              white-space: break-word;
              writing-mode:vertical-rl;
              transform: scale(0.8);
            }
          }
        }
      }
      .coupon-list-a{
        padding: 26px * 0.35;
      }
    }
  }
</style>
