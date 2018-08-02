<template>
  <div>
    <div class="container detail-container" :class="{'overflow-hidden': isShowModal}" v-if="productIsExist">
      <swiper :indicator-dots="indicatorDots"
        :autoplay="autoplay" :interval="interval" :duration="duration" 
        :indicatorColor="indicatorColor" :circular="true" :indicatorActiveColor="indicatorActiveColor">
        <swiper-item v-for="(item, index) in productDetail.pictureUris" :key="index">
          <image :lazy-load="ture" :src="item"  class="slide-image"/>
        </swiper-item>
      </swiper>
      <img class="invalid-product" src="../../assets/img/invalid-product.png" v-if="isLowerGoods" alt="">
      <div class="goods-info">
        <p class="goods-title">{{productDetail.title}}</p>
        <span class="price">￥{{price}}</span>
        <span class="reality-price">{{realityPrice}}</span>
        <!-- <span>库存:{{productStock}}</span> -->
      </div>
      <div class="selected-sku" @click="selectSku">
        <div v-if="checkedGoods.length == 0">
          <span class="label-text">选择</span>
          <span v-for="item in specificationArr" :key="item.specName">{{item.specName}} </span>
          <text class='iconfont icon-mpmall'>&#xe638;</text>
        </div>
        <div v-else>
          <span class="label-text">已选</span>
          <span v-for="item in checkedGoods" :key="item.name">{{item.value}} </span>
          <span>{{count}}件</span>
          <text class='iconfont icon-mpmall'>&#xe638;</text>
        </div>
      </div>
      <div class="btn-groups fixed">
        <div class="bar-group">
          <div class="nav-gorup">
            <div>
              <a open-type="switchTab" href="/pages/index/main">
                <text class="iconfont icon-mpmall">&#xe634;</text>
                首页
              </a>
            </div>
            <div>
              <a href="/pages/cartnotab/main">
                <text class="iconfont icon-mpmall">&#xe635;</text>
                购物车 
              </a>
            </div>
            <!-- <div>
              <button open-type="contact">
                <text class="iconfont icon-mpmall">&#xe636;</text>
                客服
              </button>
            </div> -->
          </div>
          <div class="btn-group">
            <div class="cart-btn" :class="{'disable-cart-btn': isLowerGoods}" @click="addCart">加入购物车</div>
            <div class="buy-btn" :class="{'disable-buy-btn': isLowerGoods}" @click="buyNow">立即购买</div>
          </div>
        </div>
      </div>
      <sku-detail :specificationArr="specificationArr" @removeOverflow="removeOverflow" ref="skuDetail" 
        :price="price" :realityPrice="realityPrice" :checkedGoods="checkedGoods" :productStock="productStock" @changeSkus="changeSkus" :selectedIndex="selectedIndex"
        :currentPictureUri="currentPictureUri" :skus="productDetail.skus" :skuId="skuId" :count="count" :productDetail="productDetail"></sku-detail>
      <div class="detail-img" v-html="productDetail.description"></div>
    </div>
    <div class="product-none" v-else>
      <img src="../../assets/img/product-none.png">
      <p>该商品已删除</p>
    </div>
  </div>
</template>

<script>
import { baseURL, removeRepeat } from '../../utils'
import SkuDetail from '@/components/detail/SkuDetail'
import store from '@/store/store'
export default {
  data () {
    return {
      productDetail: {},
      specificationArr: [],
      currentPictureUri: '',
      productStock: '',
      realityPrice: '',
      indicatorDots: true,
      indicatorColor: 'rgba(0, 0, 0, .3)',
      indicatorActiveColor: '#fa5f62',
      autoplay: true,
      interval: 5000,
      duration: 500,
      region: ['广东省', '广州市', '海珠区'],
      customItem: '全部',
      isShowModal: false,
      computedPrice: 0,
      skuId: '',
      productIsExist: true
    }
  },
  components: {
    SkuDetail
  },
  methods: {
    getProductDetail(id) {
      wx.request({
        url: `${baseURL}/api/product?id=${id}`,
        success: (res) => {
          if (res.statusCode == 404) {
            this.productIsExist = false
            wx.hideLoading()
            return false
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
          this.productIsExist = true
          this.selectedIndex = -1
          this.computedPrice = 0
          this.skuId = ''
          this.productDetail = res.data.data
          let reg = new RegExp( '<img' , "g" )
          this.productDetail.description = this.productDetail.description.replace(reg, '<img style="max-width:100%;height:auto" ')
          this.currentPictureUri = this.productDetail.pictureUris[0]
          let arr = this.productDetail.specifications
          let specArr = []
          this.productDetail.skus.forEach((item) => {
            item.specifications = item.specifications.sort((a, b) => {
              return a.name < b.name
            })
            item.specifications.forEach((spec) => {
              specArr.push(spec)
            })
          })
          arr = removeRepeat(specArr).sort((a, b) => {
            return a.name < b.name
          })
          // let checkedValues = this.productDetail.skus[0].specifications.map((item) => {
          //   return item.value
          // })
          let checkedValues = []
          let map = {},
            specificationArr = [];
          for (let i = 0; i < arr.length; i++) {
            let ai = arr[i]
            if (!map[ai.name]) {
              let obj = { value: ai.value, groupId: ai.name }
              if (checkedValues.includes(ai.value)) {
                obj.checked = true
              } else {
                obj.checked = false
              }
              specificationArr.push({
                specName: ai.name,
                specValues: [obj]
              })
              map[ai.name] = ai
            } else {
              let obj = { value: ai.value }
              if (checkedValues.includes(ai.value)) {
                obj.checked = true
              } else {
                obj.checked = false
              }
              for (let j = 0; j < specificationArr.length; j++) {
                let dj = specificationArr[j]
                if (dj.specName == ai.name) {
                  dj.specValues.push(obj)
                  break;
                }
              }
            }
          }
          this.specificationArr = specificationArr
          wx.hideLoading()
        }
      })
    },
    buyNow() {
      if (!this.isLowerGoods && !this.$refs.skuDetail.buyNow()) this.$refs.skuDetail.show()
    },
    addCart() {
      if (!this.isLowerGoods && !this.$refs.skuDetail.addCart()) this.$refs.skuDetail.show()
    },
    removeOverflow() {
      this.isShowModal = false
    },
    selectSku() {
      if (!this.isLowerGoods ) {
        this.$refs.skuDetail.show()
        this.isShowModal = true
      }
    },
    changeSku(specValues, spec) {
      specValues.forEach((item) => {
        item.checked = false
      })
      spec.checked = true
    },
    changeSkus(price, stock) {
      this.computedPrice = price
      if (stock) this.productStock = stock
    }
  },
  onShareAppMessage() {
    return {
      title: this.productDetail.title,
      path: '/pages/goodsdetail/main',
      imageUrl: this.productDetail.pictureUris[0]
    }
  },
  onShow() {
    if (this.$refs.skuDetail) this.$refs.skuDetail.hide()
  },
  mounted() {
    let productId = this.$root.$mp.query.productId || 91
    wx.showLoading({
      title: '加载中...'
    })
    this.getProductDetail(productId)
    store.commit('setCount', 1)
    store.commit('setCartRefresh', true)
  },
  computed: {
    isLowerGoods() {
      if (this.productDetail.status == 2) return true
      return false
    },
    count() {
      return store.state.count || 1
    },
    price() {
      if (this.productDetail.skus && this.selectedIndex != -1) {
        if (this.productDetail.skus[this.selectedIndex].pictureUri) {
          this.currentPictureUri = this.productDetail.skus[this.selectedIndex].pictureUri
        }
        this.realityPrice = this.productDetail.skus[this.selectedIndex].realityPrice
        this.productStock = this.productDetail.skus[this.selectedIndex].stock
        this.skuId = this.productDetail.skus[this.selectedIndex].skuId
        return this.productDetail.skus[this.selectedIndex].price
      } else {
        if (this.productDetail.skus) {
          if (this.computedPrice) return this.computedPrice
          let priceRange = this.productDetail.skus.map(item => item.price)
          let minPrice = Math.min.apply(null, priceRange)
          let maxPrice = Math.max.apply(null, priceRange)
          let realityPriceRange = this.productDetail.skus.map(item => item.realityPrice)
          let minRealityPrice = Math.min.apply(null, realityPriceRange)
          let maxRealityPrice = Math.max.apply(null, realityPriceRange)
          if (minRealityPrice == maxRealityPrice) {
            this.realityPrice = maxRealityPrice
          } else {
            this.realityPrice = minRealityPrice + '-' + maxRealityPrice
          }
          this.productStock = this.totalStock
          if (minPrice == maxPrice) return minPrice
          return minPrice + '-' + maxPrice
        }
      }
    },
    totalStock() {
      if (this.productDetail.skus) {
        let totalStock = 0
        this.productDetail.skus.forEach((item) => {
          totalStock += item.stock
        })
        return totalStock
      }
    },
    selectedIndex() {
      let index = -1
      if (this.productDetail.skus) {
        this.productDetail.skus.forEach((item, idx) => {
          let copyCheckedGoods = JSON.parse(JSON.stringify(this.checkedGoods))
          copyCheckedGoods.forEach((goods) => {
            delete goods.groupId
          })
          if (JSON.stringify(item.specifications) == JSON.stringify(copyCheckedGoods)) {
            index = idx
          }
        })
      }
      return index
    },
    checkedGoods() {
      let checkedSku = []
      this.specificationArr.forEach((item) => {
        if (item && item.specValues) {
          item.specValues.forEach((itm) => {
            if (itm.checked) {
              checkedSku.push({
                name: item.specName,
                value: itm.value,
                groupId: item.specName
              })
            }
          })
        }
      })
      return checkedSku.sort((a, b) => {
        return a.name < b.name
      })
      // this.productDetail.skus
    }
  }
}
</script>

<style  lang="scss">
.overflow-hidden{
  overflow: hidden;
  padding-bottom: 0 !important;
}
.product-none{
  padding-top: 226rpx;
  img{
    display: block;
    width: 180rpx;
    height: 180rpx;
    margin: 0rpx auto 30rpx auto;
  }
  p{
    text-align: center;
    font-size: 26rpx;
    color: #B3B3B3;
  }
}
.detail-container{
  position: relative;
  padding-bottom: 50px;
  background: #fafafa;
  height: auto;
  .invalid-product{
    position: absolute;
    width: 160rpx;
    height: 160rpx;
    left: 50%;
    top: 260rpx;
    margin-left: -80rpx;
  }
  .goods-info{
    padding: 40rpx 34rpx;
    background: #fff;
    margin-bottom: 24rpx;
    .goods-title{
      margin-bottom: 24rpx;
      font-size: 36rpx;
    }
    .price{
      font-size: 36rpx;
      color: #fa5f62;
      margin-right: 18rpx;
    }
    .reality-price{
      font-size: 26rpx;
      color: #909090;
      text-decoration: line-through;
    }
  }
  .selected-sku{
    padding: 30rpx 34rpx;
    background: #fff;
    margin-bottom: 24rpx;
    .icon-mpmall{
      float: right;
      font-size: 26rpx;
      margin-top: 7rpx;
      color: #bababa;
    }
    span{
      font-size: 26rpx;
      color: #888888;
    }
    .label-text{
      font-size: 32rpx;
      color: #323232;
      margin-right: 16rpx;
    }
  }
  .detail-img{
    width: 100%;
    display: block;
    img{
      width: 100%;
    }
  }
  .btn-groups{
    position: fixed;
    height: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    .bar-group{
      background-color: hsla(0,0%,100%,.95);
      position: relative;
      height: 50px;
      display: flex;
      font-size: 12px;
      &::before{
        content: "";
        height: 0;
        display: block;
        border-top: 1px solid #ddd;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
      }
      .nav-gorup{
        width: 32%;
        display: flex;
        color: #353535;
        button{
          background:none;
          line-height: 1;
          font-size: 22rpx;
          padding:0;
          border:none;
          outline:none;
          border-color:#fff;
          color: #353535;
          &:after {
            border: none;
          }
        }
        .iconfont{
          display: block;
          font-size: 40rpx;
          margin-bottom: 6rpx;
          text-align: center;
        }
        div{
          flex: 1;
          box-sizing: border-box;
          padding: 20rpx 0;
          text-align: center;
          color: #353535;
          font-size: 22rpx;
        }
      }
      .btn-group{
        width: 68%;
        display: flex;
        div{
          flex: 1;
          font-size: 30rpx;
          text-align: center;
          line-height: 50px;
          color: #fff;
        }
        .cart-btn{
          background: #fa9d5f;
        }
        .disable-cart-btn{
          color: #FABC98;
        }
        .buy-btn{
          background: #fa5f62;
        }
        .disable-buy-btn{
          color: #FA9899;
        }
      }
    }
  }
}
swiper{
  height: 700rpx;
  image{
    width: 100%;
    height: 100%;
  }
}
.sku{
  position: relative;
  margin-bottom: 10rpx;
  text{
    position: absolute;
    top: 20rpx;
    font-size: 12px;
    color: #999;
  }
  .sku-list{
    display: inline-block;
    padding: 0 0 0 60rpx;
    button{
      display: inline-block;
      font-size: 14px;
      background: #f3f2f8;
      width: auto;
      padding: 0 15rpx;
      line-height: 78rpx;
      margin-left: 10rpx;
    }
    .checked{
      background: #da4946;
      color: #fff;
    }
  }
}
</style>
