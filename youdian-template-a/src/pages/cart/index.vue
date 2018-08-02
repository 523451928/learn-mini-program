<template>
  <div class="cart-container">
    <ul class="container" v-if="cartList.length > 0">
      <li v-for="(item, index) in sortedCartList" :key="index" :class="{'translate-item': item.isTranslate}" class="cart-item" @touchstart="itemStart($event, item)" @touchmove="itemMove" @touchend="itemEnd($event, item)">
        <div class="checkbox-container">
          <span class="checkbox" @click="toggleCheck(item)" :class="{'checked': item.checked, 'disabled-checkbox': item.invalid}"></span>
        </div>
        <div class="goods-detail">
          <img :src="item.imgUrl" @click="toDetail(item)">
          <img class="invalid-img" v-if="item.invalid" src="../../assets/img/invalid-goods.png" @click="toDetail(item)">
          <div class="goods-info">
            <p class="goods-title">{{item.title}}</p>
            <p class="goods-spec" v-if="item.sku">
              <span v-for="(spec, idx) in item.sku.specifications" :key="idx">
                {{spec.name}}:{{spec.value}}
              </span>
            </p>
            <div class="price-box" v-if="item.sku">
              <span class="price">￥{{item.sku.price}}</span>
              <span class="reality-price">￥{{item.sku.realityPrice}}</span>
              <input-count v-if="!item.invalid" :count="item.count" @minusFn="minusFn(item)" @plusFn="plusFn(item)" @changeItem="changeItem(item)" @changeCount="changeCount" :maxCount="item.sku.stock"></input-count>
            </div>
          </div>
        </div>
        <div class="sider-btn" @click="deleteCart(item, index, true)">
          删除
        </div>
      </li>
    </ul>
    <div class="empty-cart" v-else>
      <img src="../../assets/img/cart-empty.png" alt="">
      <p>购物车空空如也</p>
      <p class="small-text">去逛逛吧</p>
    </div>
    <div class="settle-bar" v-if="cartList.length">
      <span class="all-check" @click="toggleAllChecked" :class="{'checked': isAllChecked}"></span>
      <span class="check-text">全选</span>
      <span class="total-money fr">
        <span>合计:</span>￥{{totalMoney}}
      </span>
      <span class="settle-btn" @click="settleFn" :class="{'disabled': totalCount == 0}">
        去结算({{totalCount}})
      </span>
    </div>
  </div>
</template>

<script>
import { baseURL, formatCartList, getSlideDirection } from '@/utils/index'
import { wxLogin, testIsLogin } from '@/utils/login'
import store from '@/store/store'
import InputCount from '@/components/public/InputCount'
export default {
  components: {
    InputCount
  },
  data () {
    return {
      productList: [],
      cartList: [],
      itemTouch: {},
      currentItem: {},
      cacheObj: {}
    }
  },
  methods: {
    settleFn() {
      if (this.checkedGoods.length > 0) {
        store.commit('setOrderList', this.checkedGoods)
        wx.setStorage({
          key: 'orderList',
          data: JSON.stringify(this.checkedGoods)
        })
        const url = '/pages/enterorder/main'
        wx.navigateTo({ url })
      }
    },
    itemStart(e, item) {
      this.itemTouch.disX = 0
      this.cartList.forEach((cart) => {
        if (JSON.stringify(cart) != JSON.stringify(item)) {
          this.$set(cart, 'isTranslate', false)
        }
      })
      this.itemTouch.isStart = true
      this.itemTouch.startX = e.touches[0].clientX
      this.itemTouch.startY = e.touches[0].clientY
    },
    itemMove(e) {
      if (this.itemTouch.isStart) {
        let moveX = e.touches[0].clientX
        let moveY = e.touches[0].clientY
        let direction = getSlideDirection(this.itemTouch.startX, this.itemTouch.startY, moveX, moveY)
        if (direction === 1 || direction === 2) {
          return false
        }
        this.itemTouch.disX = moveX - this.itemTouch.startX
        if (this.itemTouch.disX > 20) {
          return
        }
        if (this.itemTouch.disX < -80) {
          this.itemTouch.disX = -80
        }
      }
    },
    itemEnd(e, item) {
      if (this.itemTouch.disX < -40 || item.isTranslate) {
        this.$set(item, 'isTranslate', true)
      }
      if (this.itemTouch.disX > 10) {
        this.$set(item, 'isTranslate', false)
      }
    },
    deleteCart(item, index, confirm) {
      if (confirm) {
        wx.$http({
          url: `${baseURL}/api/basket/items?id=${item.id}`,
          method: 'DELETE',
          success: (res) => {
            if (res.statusCode == 200) {
              this.sortedCartList.splice(index, 1)
            } else if (res.statusCode == 401) {
              wxLogin().then(() => {
                this.deleteCart(item, index, confirm)
              })
            }
          }
        })
      } else {
        wx.showModal({
          title: '',
          content: '确定删除这一件商品么?',
          // cancelColor: '#888888',
          confirmColor: '#fa5f62',
          success: (res) => {
            if (res.confirm) {
              wx.$http({
                url: `${baseURL}/api/basket/items?id=${item.id}`,
                method: 'DELETE',
                success: (res) => {
                  if (res.statusCode == 200) {
                    this.cartList.splice(index, 1)
                  } else {
                    wx.showToast({
                      title: '删除失败',
                      icon: 'none',
                      duration: 2000
                    })
                  }
                }
              })
            } else if (res.cancel) {
            }
          }
        })
      }
    },
    toggleAllChecked() {
      if (!this.isAllChecked) {
        this.cartList.forEach((item) => {
          item.checked = true
        })
      } else {
        this.cartList.forEach((item) => {
          item.checked = false
        })
      }
    },
    toggleCheck(item) {
      if (!item.invalid) {
        item.checked = !item.checked
      }
    },
    minusFn(item) {
      item.count--
      this.modifyGoodsCount(item)
    },
    plusFn(item) {
      item.count++
      this.modifyGoodsCount(item)
    },
    changeItem(item) {
      this.currentItem = item
    },
    changeCount(val) {
      this.currentItem.count = val
      this.modifyGoodsCount(this.currentItem)
    },
    modifyGoodsCount(item) {
      wx.$http({
        url: `${baseURL}/api/basket/items/${item.id}`,
        method: 'PUT',
        data: {
          count: item.count
        },
        success: (res) => {
          if (res.statusCode == 401) {
            wxLogin().then(() => {
              this.modifyGoodsCount(item)
            })
          }
        }
      })
    },
    toDetail(item) {
      const url = '/pages/goodsdetail/main?productId='+item.productId
      wx.navigateTo({ url })
    },
    getList(list) {
      let productList = []
      let promise = Promise.resolve(productList)
      list.forEach(item => {
        promise = promise.then(() => {
          return new Promise((resolve => {
            if (this.cacheObj[item.productId]) {
              productList.push(this.cacheObj[item.productId]) 
              resolve()
            } else {
              wx.$http({
                url: `${baseURL}/api/product?id=${item.productId}`,
                success: (res) => {
                  if (res.statusCode == 200) {
                    this.cacheObj[item.productId] = res.data.data
                    productList.push(res.data.data)
                  } else {
                    productList.push({
                      title: item.productName,
                      pictureUris: [item.productPictureUri],
                      sku: {
                        specifications: item.specifications,
                        price: item.price,
                        realityPrice: item.realityPrice
                      }
                    })
                  }
                  resolve()
                }
              })
            }
          }))
        })
      })
      this.productList= productList
      return promise
    },
    getCartList() {
      let storeId = store.state.configuration.storeId || 4
      wx.showNavigationBarLoading()
      wx.$http({
        url: `${baseURL}/api/basket?storeId=${storeId}`,
        data: {
          order: 'createTimeDesc'
        },
        success: (res) => {
          if (res.statusCode == 401) {
            wxLogin().then(() => {
              this.getCartList()
            })
            return
          } if (res.statusCode == 500) {
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
          let cartList = res.data.data || []
          let cartListA = []
          let cartListB = []
          if (cartList.length > 6) {
            cartListA = cartList.slice(0, 6)
            cartListB = cartList.slice(6)
          } else {
            cartListA = cartList
          }
          if (cartList) {
            let pro = this.getList(cartListA).then((res) => {
              this.cartList = this.cartList.concat(formatCartList(cartListA, this.productList))
              console.log(this.cartList)
              wx.hideNavigationBarLoading()
              setTimeout(() => {
                if (cartListB.length) {
                  this.getList(cartListB).then((res) => {
                    this.cartList = this.cartList.concat(formatCartList(cartListB, this.productList, this.isAllChecked))
                  })
                }
              }, 800)
            })
          } else {
            wx.hideNavigationBarLoading()
          }
        },
        fail: (error) => {
          console.log(error)
          
        } 
      })
    },
    testLogin() {
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.userInfo']) {
            wx.showModal({
              title: '信息授权提示',
              content: '需要访问您的公开信息,请到小程序的设置中打开微信授权',
              confirmText: '去设置',
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      if (res.authSetting['scope.userInfo']) {
                        wxLogin().then(() => {
                          this.getCartList()
                        })
                        return true
                      } else {
                        // this.testLogin()
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
  },
  computed: {
    sortedCartList() {
      let validCartList = this.cartList.filter(item => !item.invalid)
      let invalidCartList = this.cartList.filter(item => item.invalid)
      return validCartList.concat(invalidCartList)
    },
    totalCount() {
      let count = 0
      this.cartList.forEach((item) => {
        if (item.checked && !item.invalid) {
          count += parseInt(item.count)
        }
      })
      return count
    },
    totalMoney() {
      let money = 0
      this.cartList.forEach((item) => {
        if (item.checked && !item.invalid) {
          money += parseFloat(item.sku.price) * item.count
        }
      })
      return money.toFixed(2)
    },
    checkedGoods() {
      return this.cartList.filter(item => item.checked && !item.invalid)
    },
    isAllChecked() {
      let isAllChecked = true
      let validCartList = this.cartList.filter(item => !item.invalid)
      validCartList.forEach((item) => {
        if (!item.checked) {
          isAllChecked = false
        }
      })
      if (!validCartList.length) {
        isAllChecked = false
      }
      return isAllChecked
    }
  },
  onShareAppMessage: (res) => {
    return {
      title: store.state.shareInfo.description,
      path: '/pages/cart/main',
      imageUrl: store.state.shareInfo.pictureUri
    }
  },
  mounted() {
    testIsLogin(this.getCartList)
    let shareInfo = store.state.shareInfo
    if (shareInfo.isEnable && shareInfo.scopes.indexOf('Basket') != -1) {
      wx.showShareMenu()
    } else {
      wx.hideShareMenu()
    }
  },
  onShow() {
    // if (store.state.isCartRefresh) {
    //   this.cartList = []
    //   this.cacheObj = {}
    //   store.commit('setCartRefresh', false)
    //   this.getCartList()
    // }
    this.cartList = []
    this.cacheObj = {}
    store.commit('setCartRefresh', false)
    this.getCartList()
  },
  onReachBottom() {
    
  }
}
</script>

<style lang="scss">
.cart-container{
  background: #fafafa;
  min-height: 100%;
  width: 100%;
  overflow-x: hidden;
  .empty-cart{
    padding-top: 176rpx;
    text-align: center;
    font-size: 28rpx;
    color: #353535;
    img{
      width: 180rpx;
      height: 180rpx;
      margin-bottom: 30rpx;
    }
    .small-text{
      font-size: 26rpx;
      color: #b2b2b2;
      margin-top: 14rpx;
    }
  }
  .settle-bar{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    background: #fafafa;
    color: #333333;
    font-size: 26rpx;
    border-top: 1rpx solid #dadada;
    z-index: 100;
    .total-money{
      margin-right: 220rpx;
      span{
        color: #888888;
        font-size: 24rpx;
      }
    }
    .settle-btn{
      display: inline-block;
      position: fixed;
      right: 0;
      width: 188rpx;
      height: 80rpx;
      text-align: center;
      background: #fa5f62;
      color: #fff;
      font-size: 30rpx;
    }
    .disabled{
      color: #999;
      background: #d7d7d7;
    }
    .all-check{
      position:relative;
      top:12rpx;
      left:14rpx;
      margin-right: 12rpx;
      width: 40rpx;
      height: 40rpx;
      display: inline-block;
      background: url('../../assets/img/unchecked.png');
      background-size: contain;
      border: 10rpx solid #fafafa;
    }
    .check-text{
      position: absolute;
    }
    .checked{
      background: url('../../assets/img/checked.png');
      background-size: contain;
    }
    
  }
  .container{
     padding-bottom: 80rpx;
     width: 100%;
     overflow-x: hidden;
     .translate-item{
       transform: translateX(-120rpx)
     }
    .cart-item{
      background: #fff;
      margin-bottom: 24rpx;
      padding: 24rpx 24rpx 24rpx 0;
      display: flex;
      transition: all .3s;
      width:100%;
      box-sizing:border-box;
      position: relative;
      .sider-btn{
        position: absolute;
        top: 0;
        right: -140rpx;
        width: 140rpx;
        height: 100%;
        line-height: 9;
        text-indent: 40rpx;
        background: #fa5f62;
        color: #fff;
        font-size: 24rpx;
      }
      .checkbox-container{
        width: 86rpx;
        text-align: center;
        margin-top: 50rpx;
        // vertical-align: middle;
        // line-height: 160rpx;
        .checkbox{
          width: 40rpx;
          height: 40rpx;
          display: inline-block;
          background: url('../../assets/img/unchecked.png');
          background-size: contain;
          border: 10rpx solid #fff;
        }
        .checked{
          background: url('../../assets/img/checked.png');
          background-size: contain;
        }
        .disabled-checkbox{
          background: url('../../assets/img/disable-checkbox.png');
          background-size: contain;
        }
      }
      .goods-detail{
        display: flex;
        position: relative;
        width: 90%;
        height: 160rpx;
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
        }
        .invalid-img{
          width: 120rpx;
          height: 120rpx;
          position: absolute;
          left: 20rpx;
          top: 20rpx;
        }
        .goods-info{
          position: relative;
          flex: 1;
          margin-left: 12rpx;
          .goods-title{
            font-size: 24rpx;
            color: #353535;
            width: 440rpx;
            white-space: nowrap;
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
          }
        }
      }
    }
  }
}
</style>
