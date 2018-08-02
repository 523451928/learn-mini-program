<template>
  <div class="bg home-content">
    <h5 class="home-title">
      {{storeName}}
    </h5>
    <!-- 订单面板 -->
    <div class="line order-box" data-flex="dir:left cross:top main:justify box:mean">
      <div class="order-panel" data-flex="dir:top cross:center main:center" @click="routerjump('/customer/order.html#/allorder?orderStatus=StockConfirmed', 'order')">
        <span id="pay-count" class="order-number">{{orders.pay}}</span>
        <p>待付款订单</p>
      </div>
      <div class="order-panel" data-flex="dir:top cross:center main:center" @click="routerjump('/customer/order.html#/deliveryorder?orderStatus=Paid', 'order')">
        <span id="ship-count" class="order-number">{{orders.ship}}</span>
        <p>待发货订单</p>
      </div>
      <div class="order-panel" data-flex="dir:top cross:center main:center" @click="routerjump('/customer/order.html#/aftersaleorder?orderStatus=0', 'order')">
        <span id="sale-count" class="order-number">{{orders.sale}}</span>
        <p>售后订单 </p>
      </div>
      <div class="order-panel" data-flex="dir:top cross:center main:center" @click="routerjump('/customer/order.html#/allorder?orderStatus=yesterday', 'order')">
        <span id="yester-count" class="order-number">{{orders.yester}}</span>
        <p>昨日订单</p>
      </div>
    </div>
    <!-- 功能面板 -->
    <div class="line function-box title-box">
      <h6>
        常用功能
      </h6>
      <div class="function-wrapper" data-flex="dir:left box:mean">
        <div class="function-panel" data-flex="dir:top cross:center main:center" @click="routerjump('/customer/managegoods.html#/allgoods/addgoods', 'product')">
          <div class="img-box">
            <img src="../../../assets/imgs/home/icon-1.png" alt="发布商品">
          </div>
          <p>发布商品</p>
        </div>
        <div class="function-panel" data-flex="dir:top cross:center main:center" @click="routerjump('/customer/marketing.html#/coupon', 'coupon')">
          <div class="img-box">
            <img src="../../../assets/imgs/home/icon-2.png" alt="优惠券">
          </div>
          <p>优惠券</p>
        </div>
        <div class="function-panel" data-flex="dir:top cross:center main:center" @click="routerjump('/customer/product.html#/productrenovation', 'store')">
          <div class="img-box">
            <img src="../../../assets/imgs/home/icon-3.png" alt="店铺装修">
          </div>
          <p>店铺装修</p>
        </div>
        <div class="function-panel" data-flex="dir:top cross:center main:center" @click="routerjump('/customer/setting.html#/customertool', 'customer')">
          <div class="img-box">
            <img src="../../../assets/imgs/home/icon-4.png" alt="客服工具">
          </div>
          <p>客服工具</p>
        </div>
      </div>
    </div>
    <!-- 帮助中心 -->
    <div class="line help-box" data-flex="dir:left cross:top box:last">
      <div class="left-box title-box">
        <h6>帮助中心</h6>
        <div class="help-wrap" data-flex="dir:left box:mean">
          <div class="help-panel" data-flex="dir:left cross:center" @click="routerjump()">
            <div class="img-box">
              <img src="../../../assets/imgs/home/icon-5.png" alt="开店帮助">
            </div>
            <span>开店帮助</span>
          </div>
          <div class="help-panel" data-flex="dir:left cross:center" @click="routerjump()">
            <div class="img-box">
              <img src="../../../assets/imgs/home/icon-6.png" alt="小程序发布">
            </div>
            <span>小程序发布</span>
          </div>
          <div class="help-panel" data-flex="dir:left cross:center" @click="routerjump()">
            <div class="img-box">
              <img src="../../../assets/imgs/home/icon-7.png" alt="店铺装修">
            </div>
            <span>店铺装修</span>
          </div>
          <div class="help-panel" data-flex="dir:left cross:center" @click="routerjump()">
            <div class="img-box">
              <img src="../../../assets/imgs/home/icon-8.png" alt="支付配置">
            </div>
            <span>支付配置</span>
          </div>
        </div>
      </div>
      <div class="right-box title-box">
        <h6>友店客服</h6>
        <div class="service-wrap" data-flex="dir:left cross:center">
          <span class="qq">QQ: 2463587410</span>
          <span class="tel">客服电话: 0571-62548563</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
const BASEURL = '/api/Order/summarys'
import CountUp from '@/assets/js/countup.js'
import Time from '@/assets/js/class/Time.js'
import logo from 'assets/imgs/logo.png'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      shopname: '', // 店铺名称
      orders: {
        pay: 0, // 支付订单数
        ship: 0, // 发货订单数
        sale: 0, // 售后订单数
        yester: 0, // 昨日订单数
      },
      shopid: window.localStorage.getItem('storeId'),
      storeName: ''
    }
  },
  created() {
    this.bus.$off('storename').$on('storename', res => {
      this.storeName = res
    })
    this.getPayOrder()
    this.getShipOrder()
    this.getSaleOrder()
    this.getYesterOrder()
  },
  computed: {
    ...mapGetters([
      "getPermissions",
      "getMain"
    ]),
    // 是否具有订单权限
    isOrderPurview() {
      return this.getPermissions.indexOf('Order') !== -1 ? true : false
    },
    // 是否具有优惠券权限
    isCouponPurview() {
      return this.getPermissions.indexOf('Coupon') !== -1 ? true : false
    },
    // 是否有发布商品权限
    isProductPurview() {
      return this.getPermissions.indexOf('Product') !== -1 ? true : false
    },
    // 是否有店铺装修权限
    isStorePurview() {
      return this.getPermissions.indexOf('StoreFacade') !== -1 ? true : false
    },
    // 是否有客服工具权限
    isCustomerPurview() {
      return this.getPermissions.indexOf('CustomerSetting') !== -1 ? true : false
    }
  },
  methods: {
    /**
     * 路由跳转,根据挑战的type判断
     * @argument(String) url 需要跳转的路由地址
     */
    routerjump(url, type) {
      if (typeof url != 'string') {
        return
      }
      // if (this.getMain) {
      //   window.location.href = url
      //   return        
      // }
      if (!type) {
        window.location.href = url
        return
      }
      switch(type) {
        case 'order':
          if (!this.isOrderPurview) {
            this.$message.warning('暂时没有权限，请联系管理员开通')
            return
          } 
          break
        case 'coupon':
          if (!this.isCouponPurview) {
            this.$message.warning('暂时没有权限，请联系管理员开通')
            return
          }
          break
        case 'product':
          if (!this.isProductPurview) {
            this.$message.warning('暂时没有权限，请联系管理员开通')
            return
          }
          break
        case 'customer':
          if (!this.isCustomerPurview) {
            this.$message.warning('暂时没有权限，请联系管理员开通')
            return
          }
          break
        case 'store':
          if (!this.isStorePurview) {
            this.$message.warning('暂时没有权限，请联系管理员开通')
            return
          }
          break
      }
      window.location.href = url
    },
    // 获取支付订单
    getPayOrder() {
      this.$http.get(`${BASEURL}?IncludeStatus=StockConfirmed&StoreId=${this.shopid}&pageIndex=1&pageSize=1`).then((res) => {
        this.orders.pay = res.data.data.totalDataCount ? res.data.data.totalDataCount : 0
        this.orders.pay && new CountUp("pay-count", 0, this.orders.pay, 0, 1).start()
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getPayOrder()
        })
      })
    },
    // 获取发货订单
    getShipOrder() {
      this.$http.get(`${BASEURL}?StoreId=${this.shopid}&pageIndex=1&pageSize=1&IncludeStatus=Paid`).then((res) => {
        this.orders.ship = res.data.data.totalDataCount ? res.data.data.totalDataCount : 0
        this.orders.ship && new CountUp("ship-count", 0, this.orders.ship, 0, 1).start()
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getShipOrder()
        })
      })
    },
    // 获取售后订单
    getSaleOrder() {
      this.$http.get(`${BASEURL}?StoreId=${this.shopid}&pageIndex=1&pageSize=1&IncludePaymentMethods=Wechat&IncludeCancelStatus=0`).then((res) => {
        this.orders.sale = res.data.data.totalDataCount ? res.data.data.totalDataCount : 0
        this.orders.sale && new CountUp("sale-count", 0, this.orders.sale, 0, 1).start()
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getSaleOrder()
        })
      })
    },
    // 获取昨日订单
    getYesterOrder() {
      const time = new Time()
      const yesterday = time.getPrevDate()
      const start = time.formatDate(time.getStartDate(yesterday))
      const end = time.formatDate(time.getEndDate(yesterday))
      this.$http.get(`${BASEURL}?StoreId=${this.shopid}&pageIndex=1&pageSize=1&CreateTimeStart=${start}&CreateTimeEnd=${end}`).then(res => {
        this.orders.yester = res.data.data.totalDataCount ? res.data.data.totalDataCount : 0
        this.orders.yester && new CountUp("yester-count", 0, this.orders.yester, 0, 1).start()
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getYesterOrder()
        })
      })
    }
  },

}
</script>

<style lang="scss" scoped>
@import '~@/assets/css/variables.scss';
@import '~@/assets/css/mixin.scss';
img {
  width: 100%;
}
.home-content {
  padding: 0 48px;
  .home-title {
    font-size: 22px;
    color: $routine-text-color;
    line-height: 85px;
    height: 85px;
  }
  .line {
    margin-bottom: 32px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .title-box {
    > h6 {
      box-sizing: border-box;
      padding-left: 20px;
      height: 49px;
      line-height: 49px;
      color: $main-text-color;
      border-bottom: 1px solid $c-border-color;
    }
  }
  // 订单
  .order-box {
    .order-panel {
      margin-right: 24px;
      box-sizing: border-box;
      background-color: $c-nc-1;
      @include panelShadown;
      border-radius: 4px;
      height: 160px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      .order-number {
        margin-bottom: 32px;
        color: $blue-color;
        font-size: 36px;
      }
      p {
        color: $routine-text-color;
        font-size: 16px;
      }
    }
  }
  // 功能
  .function-box {
    background-color: $c-nc-1;
    @include panelShadown;
    .function-wrapper {
      padding: 30px 0;
      .function-panel {
        position: relative;
        cursor: pointer;
        &:after {
          content: '';
          position: absolute;
          display: block;
          right: 0;
          top: 0;
          bottom: 0;
          width: 1px;
          background-color: $c-nc-2;
        }
        &:last-child {
          &:after {
            background-color: transparent;
          }
        }
        .img-box {
          margin-bottom: 15px;
          width: 96px;
        }
        > p {
          color: $routine-text-color;
          font-size: 14px;
        }
      }
    }
  }
  .help-box {
    > div {
      @include panelShadown;
      box-sizing: border-box;
      background-color: $c-nc-1;
      &.left-box {
        margin-right: 24px;
        .help-wrap {
          padding: 0 22px;
          height: 107px;
          .help-panel {
            cursor: pointer;
            > .img-box {
              margin-right: 16px;
              width: 40px;
            }
            > span {
              font-size: 14px;
              color: $secondary-text-color;
            }
          }
        }
      }
      &.right-box {
        width: 404px;
        .service-wrap {
          padding: 0 22px;
          height: 107px;
          font-size: 14px;
          .qq {
            margin-right: 48px;
            color: $secondary-text-color;
          }
          .tel {
            color: $secondary-text-color;
          }
        }
      }
    }
  }
}
</style>
