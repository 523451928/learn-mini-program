<template>
    <div class="me-container">
        <div class="m-user">
            <img :src="user.headimg" class="headimg"/><span class="nickname">{{user.nickname}}</span>
        </div>  
        <div class="m-order">
            <div class="header">全部订单<p @click="toAllOrders" class="rightlink"><i class="iconfont icon-ziyuan5 icon-mpmall">&#xe638;</i></p></div>    
            <ul class="orderStatusUl">
              <li @click="toOrder(1)">
                <i class="iconfont icon-ziyuan10 icon-mpmall">&#xe63d;</i><p class="orderStatus">待付款</p>
              </li>
              <li @click="toOrder(2)">
                <i class="iconfont icon-ziyuan13 icon-mpmall">&#xe640;</i><p class="orderStatus">待发货</p>
              </li>
              <li @click="toOrder(3)">
                <i class="iconfont icon-ziyuan15 icon-mpmall">&#xe642;</i><p class="orderStatus">待收货</p>
              </li>
              <li @click="toOrder(4)">
                <i class="iconfont icon-ziyuan16 icon-mpmall">&#xe643;</i><p class="orderStatus">售后服务</p>
              </li>
            </ul>    
        </div> 
        <ul class="m-funs">
          <li @click="toCouponListPage" class="funitem">
            <i class="iconfont icon-my_coupons icon-mpmall">&#xe610;</i>
            <span class="funname">我的优惠券</span>
            <i class="iconfont icon-ziyuan5 icon-mpmall">&#xe638;</i>
          </li>
        </ul> 
        <ul class="m-funs">
          <li class="funitem">
            <i class="iconfont icon-my_address icon-mpmall">&#xe60f;</i>
            <span class="funname">我的地址</span>
            <i class="iconfont icon-ziyuan5 icon-mpmall">&#xe638;</i>
          </li>
          <li class="funitem">
            <i class="iconfont icon-my_customer icon-mpmall">&#xe611;</i>
            <span class="funname">联系客服</span>
            <i class="iconfont icon-ziyuan5 icon-mpmall">&#xe638;</i>
          </li>
        </ul>   
    </div>   
</template>
<script>
let defaultHeadimg = require("@/assets/imgs/default-avatar.png")
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      user: {
        nickname: "未登录",
        headimg: defaultHeadimg
      }
    };
  },
  methods: {
    ...mapMutations([
      'setNavBar'
    ]),
    toAllOrders() {
      // this.$router.push()
    },
    toCouponListPage() {
      this.setNavBar(false)
      this.$router.push({
        path: '/couponlist'
      })
    },
    toOrder(type) {
      let orderTypeArr = []
    }
  },
  created() {
  }
};
</script>
<style lang="scss" >
body {
  background: #f7f7f7;
}
.me-container {
  font-size: 0.28rem;
  height: 100%;
  background: #f7f7f7;
  .m-order {
    padding: .4rem .2rem .4rem;
    background: #fff;
    .header {
      font-size: 0.32rem;
      line-height: 1;
      color: #353535;
      .rightlink {
        color: #999;
        float: right;
        font-size: 0.24rem;
        i {
          font-size: 0.2rem;
          margin-left: 0.12rem;
        }
      }
    }
    .orderStatusUl {
      margin-top: 0.6rem;
      display: flex;
      padding: 0 11px;
      justify-content: space-between;
      > li {
        width: 1.04rem;
        text-align: center;
        justify-content: center;
        i {
          font-size: 0.48rem;
          display: inline-block;
          color: #353535;
        }
        .orderStatus {
          color: #353535;
          font-size: 0.26rem;
          margin-top: .26rem;
        }
      }
    }
  }
  // 功能列表项
  .m-funs {
    margin-top: 10px;
    background: #fff;
    line-height: 0.32rem;
    > li {
      padding: 0 .24rem;
      line-height: .9rem;
      .funname {
        color: #353535;
        font-size: 0.32rem;
      }
      .icon-my_coupons,
      .icon-my_address,
      .icon-my_customer {
        color: #fa5f62;
        margin-right: .1rem;
        font-size: 0.32rem;
      }
      .icon-ziyuan5 {
        color: #999;
        font-size: 0.2rem;
        float: right;
      }
      &:first-child {
        border-top: none;
      }
      &:not(:first-child) {
        border-top: 1px solid #ededed;
      }
    }
  }
  .m-user {
    background: #fff;
    padding: 17px 20px 12px;
    overflow: hidden;
    border-bottom: #ebebeb 1px solid;
    .headimg {
      width: 1.3rem;
      height: 1.3rem;
      float: left;
    }
    .nickname {
      float: left;
      color: #333333;
      font-size: 0.32rem;
      margin-left: 21px;
      line-height: 1.3rem;
    }
  }
}
</style>