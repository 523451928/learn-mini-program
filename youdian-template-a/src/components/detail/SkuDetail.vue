<template>
  <div class="sku-mask" @click="hide" :class="{'sku-hide': maskVisible}" >
    <div class="sku-content" @click.stop :class="{'sku-show': skuVisible}">
      <div class="goods-info">
        <img v-if="currentPictureUri" :src="currentPictureUri" alt="">
        <div class="goods-text">
          <p class="goods-price">￥{{price}}</p>
          <p class="goods-spec">
            <span v-for="item in checkedGoods" :key="item.name">{{item.value}}/</span><span>{{count}}件</span>
          </p>
          <p class="product-stock">
            <span v-show="productStock !== ''">库存{{productStock}}件</span>
          </p>
          <span class="close-btn" @click="hide"></span>
        </div>
      </div>
      <scroll-view class="sku-wrapper" v-if="specificationArr.length" scroll-y>
        <div v-for="(item, index) in specificationArr" class="sku" :key="index">
          <div class="spec-name">
            {{item.specName}}
          </div>
          <view class="sku-list">
            <span @click="changeSku(item, spec)" :key="idx" class="sku-btn" :class="{'checked': spec.checked, 'disabled': spec.disabled}" v-for="(spec, idx) in item.specValues" >
              {{spec.value}}
            </span>
          </view>
        </div>
      </scroll-view>
      <div class="select-count">
        <span class="text">选择数量</span>
        <input-count :count="count" @minusFn="minusFn" @plusFn="plusFn" :maxCount="productStock" @changeCount="changeCount"></input-count>
      </div>
      <div class="foot-btn-group">
        <button class="cart-btn" @click="addCart" :class="{'disable': productStock == 0}">加入购物车</button>
        <button class="buy-btn" @click="buyNow" :class="{'disable': productStock == 0}">立即购买</button>
      </div>
    </div>
  </div>
</template>

<script>
import { difference, removeRepeat, baseURL } from '../../utils/index.js'
import { wxLogin, testIsLogin } from '@/utils/login'
import { getSkus } from './sku.js'
import store from '@/store/store'
import InputCount from '@/components/public/InputCount'
export default {
  components: {
    InputCount
  },
  props: {
    productDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    specificationArr: {
      type: Array,
      default() {
        return []
      }
    },
    checkedGoods: {
      type: Array,
      default() {
        return []
      }
    },
    skus: {
      type: Array,
      default() {
        return []
      }
    },
    price: [Number, String],
    realityPrice: [Number, String],
    selectedIndex: [Number, String],
    skuId: [Number, String],
    currentPictureUri: [Number, String],
    productId: [Number, String],
    productStock: [Number, String],
    count: [Number, String]
  },
  data() {
    return {
      skuVisible: false,
      maskVisible: true,
      cacheCount: 1,
      skuData: {},
      storeId: '',
      isInCartlist: false,
      id: 0,
      cartList: []
    }
  },
  methods: {
    buyNow() {
      if (this.examinALLskuSelect()) {
        if (!this.productStock) {
          wx.showToast({
            title: '暂无库存',
            icon: 'none'
          })
          return false
        }
        let goodsDetail = {
          productId: this.productDetail.productId,
          count: this.count,
          storeId: this.storeId,
          title: this.productDetail.title,
          skuId: this.skuId,
          imgUrl: this.currentPictureUri,
          freightTemplateId: this.productDetail.freightTemplateId,
          sku: this.skus[this.selectedIndex],
          from: 'ProductDetail'
        }
        store.commit('setOrderList', [goodsDetail])
        const url = '/pages/enterorder/main'
        wx.navigateTo({ url })
        return true
      } else {
        return false
      }
    },
    addCart() {
      if (this.examinALLskuSelect()) {
        let specifications = []
        this.specificationArr.forEach((item) => {
          let obj = {
            name: item.specName
          }
          item.specValues.forEach((spec) => {
            if (spec.checked) {
              obj.value = spec.value
            }
          })
          specifications.push(obj)
        })
        let productId = this.$root.$mp.query.productId || 2
        let goodsDetail = {
          productId,
          specifications,
          count: this.count,
          productName: this.productDetail.title,
          productPictureUri: this.currentPictureUri,
          price: this.price,
          realityPrice: this.realityPrice,
          storeId: this.storeId,
          skuId: this.skuId
        }
        let isInCartlist = this.isInCartlist
        let count
        this.cacheCount + this.count > this.productStock ? count = this.productStock : count = this.cacheCount + this.count
        if (!this.productStock) {
          wx.showToast({
            title: '暂无库存',
            icon: 'none'
          })
          return false
        }
        if (isInCartlist) {
          wx.$http({
            url: `${baseURL}/api/basket/items/${this.id}`,
            method: 'PUT',
            data: {
              count
            },
            success: (res) => {
              if (res.statusCode == 401) {
                wxLogin().then(() => {
                  this.addCart()
                })
                return
              }
              this.cacheCount = count
              if (res.statusCode >= 200 && res.statusCode < 300) {
                wx.showToast({
                  title: '成功加入购物车'
                })
              } else if(res.statusCode == 500) {
                wx.showToast({
                  title: '服务器异常',
                  icon: 'none'
                })
              } else if(res.statusCode > 500) {
                wx.showToast({
                  title: '服务器繁忙，请稍后重试',
                  icon: 'none'
                })
              }
            }
          })
        } else {
          wx.$http({
            url: `${baseURL}/api/basket/items`,
            method: 'POST',
            data: goodsDetail,
            success: (res) => {
              if (res.statusCode == 401) {
                wxLogin().then(() => {
                  this.addCart()
                })
                return
              }
              if (res.statusCode >= 200 && res.statusCode < 300) {
                wx.showToast({
                  title: '成功加入购物车'
                })
                let data = res.data.data
                this.isInCartlist = true
                this.id = data.id
                this.cacheCount = data.count
              } else if(res.statusCode == 500) {
                wx.showToast({
                  title: '服务器异常',
                  icon: 'none'
                })
              } else if(res.statusCode > 500) {
                wx.showToast({
                  title: '服务器繁忙，请稍后重试',
                  icon: 'none'
                })
              }
            }
          })
        }
        return true
      } else {
        return false
      }
    },
    examinALLskuSelect() {
      let checkedArr = this.checkedGoods.map(item => item.name)
      let specArr = this.specificationArr.map(item => item.specName)
      let diffArr = difference(checkedArr, specArr)
      if (diffArr.length > 0) {
        // let title = `请选择${diffArr[0]}`
        let title = `请选择${diffArr.join('/')}`
        wx.showToast({
          title,
          icon: 'none'
        })
        return false
      }
      return true
    },
    minusFn() {
      if (this.count == 1 || this.count === 0) return
      this.count--
    },
    plusFn() {
      if (this.count >= this.productStock && this.productStock !== '') return
      this.count++
    },
    changeCount(val) {
      this.count = val
    },
    hide() {
      setTimeout(() => {
        this.maskVisible = true
      }, 300)
      this.skuVisible = false
      this.$emit('removeOverflow')
    },
    show() {
      setTimeout(() => {
        this.skuVisible = true
      }, 300)
      this.maskVisible = false
    },
    changeSku(itm, spec) {
      if (spec.disabled) return
      itm.specValues.forEach((item) => {
        if (JSON.stringify(item) != JSON.stringify(spec)) item.checked = false
      })
      spec.checked = !spec.checked
      if (spec.checked) {
        this.$set(itm, 'hasChecekdChild', true)
      } else {
        this.$set(itm, 'hasChecekdChild', false)
      }
      setTimeout(() => {
        let checkedStr = this.checkedGoods.map(item => item.value).sort((a, b) => {
          return a > b
        }).join(';')
        let productStock = 0
        let price = 0
        for (let key in this.skuData) {
          if (checkedStr == key) {
            let prices = this.skuData[key].prices
            let minPrice = Math.min.apply(null, prices)
            let maxPrice = Math.max.apply(null, prices)
            if (prices.length > 1 && minPrice != maxPrice) {
              price = minPrice + '-' + maxPrice
            } else {
              price = maxPrice
            }
            productStock = this.skuData[key].count
          }
        }
        this.$emit('changeSkus', price, productStock)
        let unCheckedSkus = []
        this.specificationArr.forEach((item) => {
          item.specValues.forEach((spec) => {
            this.$set(spec, 'groupId', item.specName)
            if (!spec.checked) unCheckedSkus.push(spec)
          })
        })
        let checkedGoods = this.checkedGoods.map(itm => itm.value)
        unCheckedSkus.forEach((item) => {
          let testSkus = []
          let siblingsSelectedArr = []
          this.checkedGoods.forEach((goods) => {
            if (item.groupId == goods.groupId) siblingsSelectedArr.push(goods)
          })
          if(siblingsSelectedArr.length) {
            for (let j = 0;j < siblingsSelectedArr.length;j++) {
              for(var i = 0; i < checkedGoods.length; i++) {
                (checkedGoods[i] != siblingsSelectedArr[j].value) && testSkus.push(checkedGoods[i])
              }
            }
          } else {
            testSkus = checkedGoods.concat()
          }
          testSkus = testSkus.concat(item.value)
          // testSkus.sort((a, b) => {
          //   return a > b
          // })
          testSkus.sort()
          if (!this.skuData[testSkus.join(';')]) {
            this.$set(item, 'disabled', true)
            // console.log(item)
          } else {
            this.$set(item, 'disabled', false)
          }
        })
      }, 100)
    },
    getCartList() {
      this.storeId = store.state.configuration.storeId || wx.getStorageSync('storeId')
      wx.$http({
        url: `${baseURL}/api/basket?storeId=${this.storeId}`,
        success: (res) => {
          if (res.statusCode == 401) {
            testIsLogin(this.getCartList)
            return
          }
          if (res.data.data) {
            this.cartList = res.data.data
            let isInCartlist = false
            this.cartList.forEach((item) => {
              if (item.skuId == this.skuId) {
                isInCartlist = true
                this.cacheCount = item.count
                this.id = item.id
              }
            })
            this.isInCartlist = isInCartlist
          }
        }
      })
    }
  },
  watch: {
    productStock(newVal) {
      if (this.count === 0) this.count = 1
      if (newVal <= this.count) this.count = newVal
    },
    count(newVal) {
      store.commit('setCount', newVal)
    },
    skuId(newVal) {
      this.getCartList()
    },
    skus(newVal) {
      let data = {}
      newVal.forEach((item) => {
        if (item.stock) {
          let key = item.specifications.map(spec => spec.value).join(';')
          data[key] = { price: item.price, count: item.stock }
        }
      })
      let skuData = getSkus(data)
      this.skuData = skuData
      this.specificationArr.forEach((item) => {
        item.specValues.forEach((spec) => {
          if (!skuData[spec.value]) {
            this.$set(spec, 'disabled', true)
          }
        })
      })
    }
  },
  onShow() {
    this.getCartList()
  }
}
</script>

<style lang="scss">
.sku-mask{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0,0,0,0.6);
  transition: all 1s;
  .sku-content{
    position: absolute;
    width: 100%;
    background: #fff;
    border-top-left-radius: 16rpx;
    border-top-right-radius: 16rpx;
    // height: 750rpx;
    max-height: 1034rpx;
    min-height: 422rpx;
    bottom: -1000rpx;
    transition: all .3s;
    .goods-info{
      height: 204rpx;
      box-sizing: border-box;
      border-bottom: 1px solid #f6f6f6;
      padding: 32rpx;
      margin: 0;
      border-top-left-radius: 16rpx;
      border-top-right-radius: 16rpx;
      image{
        display: inline-block;
        width: 140rpx;
        height: 140rpx;
        float: left;
      }
      .goods-text{
        position: relative;
        box-sizing: border-box;
        margin-left: 156rpx;
        .goods-price{
          font-size: 30rpx;
          color: #fa5f62;
          margin-bottom: 8rpx;
        }
        .goods-spec,.product-stock{
          margin-bottom: 6rpx;
          span{
            font-size: 22rpx;
            color: #888888;
          }
        }
      }
      .close-btn{
        position: absolute;
        display: inline-block;
        width: 24px;
        height: 24px;
        right: 0;
        top: 0;
        transform: rotate(45deg);
        margin-top: -6px;
        margin-right: -6px;
        &::after{
          content: "";
          position: absolute;
          width: 16px;
          height: 2px;
          background: #646464;
          border-radius: 2px;
          left: 50%;
          top: 50%;
          margin-top: -1px;
          margin-left: -8px;
        }
        &::before{
          content: "";
          position: absolute;
          background: #646464;
          border-radius: 2px;
          left: 50%;
          width: 2px;
          height: 16px;
          top: 50%;
          margin-top: -8px;
          margin-left: -1px;
        }
      }
    }
    .foot-btn-group{
      display: flex;
      width: 100%;
      box-sizing: border-box;
      padding: 32rpx 10rpx;
      button{
        width: 332rpx;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 30rpx;
        border-radius: 40rpx;
        color: #fff;
        &::after{
          border: none;
        }
      }
      .cart-btn{
        background: #fa9d5f;
      }
      .buy-btn{
        background: #fa5f62;
      }
    }
    .select-count{
      height: 114rpx;
      line-height: 114rpx;
      padding: 0 32rpx;
      box-sizing: border-box;
      border-bottom: 1px solid #f6f6f6;
      .text{
        font-size: 26rpx;
        color: #323232;
      }
    }
    .sku-wrapper{
      // height: 288rpx;
      height: auto;
      max-height: 488rpx;
      min-height: 150rpx;
      border-bottom: 1px solid #f6f6f6;
      padding-bottom: 10rpx;
      overflow: hidden;
      .sku{
        position: relative;
        margin-bottom: 10rpx;
        .spec-name{
          font-size: 26rpx;
          color: #323232;
        }
        .spec-name{
          padding: 0 0 0 32rpx;
          line-height: 62rpx;
          margin-top: 8rpx;
        }
        .sku-list{
          display: inline-block;
          padding: 0 0 0 28rpx;
          .sku-btn{
            display: inline-block;
            font-size: 12px;
            background: #f0f0f0;
            border: none;
            outline: none;
            width: auto;
            padding: 0 15rpx;
            min-width: 130rpx;
            text-align: center;
            box-sizing: border-box;
            line-height: 56rpx;
            margin-right: 10rpx;
            border-radius: 28rpx;
          }
          .checked{
            background: #fa5f62;
            color: #fff;
          }
          .disabled{
            background: #f5f5f5;
            color: #b2b2b2;
          }
        }
      }
    }
  }
  .sku-show{
    bottom: 0;
  }
}
.sku-hide{
  display: none;
}
</style>