<template>
  <div class="container goods-list-container">
    <view class="goods-list clearfix" v-if="goodsList.length">
      <view v-for="(item, index) in goodsList" :key="index" class='goods-item'>
        <view>
          <a :href="'/pages/goodsdetail/main?productId='+item.productId">
            <image :src="item.pictureUris[0]" />
            <div class="goods-info">
              <p class="goods-name">
                <span>{{item.title}}</span>
              </p>
              <p class="goods-price">
                <span>￥{{item.minSkuPrice}}</span>
              </p>
              <p class="reality-price">￥{{item.minSkuRealityPrice}}</p>
            </div>
          </a>
        </view>
      </view>
    </view>
    <div v-if="isAllLoaded && goodsList.length" class="no-more">-没有更多商品了-</div>
    <div class="no-goods" v-if="noGoods">
      <image :src="noGoodsImg" />
      <p>未搜索到相关商品</p>
    </div>
    <mp-loading v-if="!isAllLoaded" :loadVisible="isLoadmore"></mp-loading>
  </div>
</template>

<script>
import { baseURL } from '../../utils'
import MpLoading from '@/components/public/MpLoading'
export default {
  components: {
    MpLoading
  },
  data () {
    return {
      goodsList: [],
      pageIndex: 1,
      enableProductList: [],
      disableProductList: [],
      queryObj: {},
      queryStr: '',
      isLoadmore: false,
      isAllLoaded: false,
      noGoods: false,
      groupId: '',
      pageSize: 10,
      noGoodsImg: require('@/assets/img/no-goods.png')
    }
  },
  methods: {
    getList(list) {
      let productList = this.goodsList
      let promise = Promise.resolve(productList)
      this.isLoadmore = true
      list.forEach(item => {
        promise = promise.then(() => {
          return new Promise((resolve => {
            wx.request({
              url: `${baseURL}/api/product?id=${item}`,
              success: (res) => {
                resolve()
                let data = res.data.data
                let priceArr = data.skus.map(sku => sku.price)
                let realityPriceArr = data.skus.map(sku => sku.realityPrice)
                this.$set(data, 'minSkuPrice', Math.min.apply(null, priceArr))
                this.$set(data, 'minSkuRealityPrice', Math.min.apply(null, realityPriceArr))
                productList.push(data)
              }
            })
          }))
        })
      })
      if (!this.enableProductList.length) {
        this.isAllLoaded = true
        this.isLoadmore = false
      }
      wx.hideLoading()
      this.goodsList = productList
      return promise
    },
    getSummarys() {
      this.isLoadmore = true
      wx.request({
        url: `${baseURL}/api/product/summarys`,
        data: {
          Title: this.queryStr,
          StoreId: wx.getStorageSync('storeId'),
          order: 'OrderDes',
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          groupId: this.groupId
        },
        success: (res) => {
          let data = [...res.data.data.currentPageDatas]
          if (data.length == 0 || data.length < this.pageSize) {
            this.isAllLoaded = true
          }
          let idList = this.disableProductList
          if (idList.length) {
            idList.forEach((id) => {
              data.forEach((item, index) => {
                if (item.productId == id) {
                  data.splice(index, 1)
                }
              })
            })
          }
          this.goodsList = this.goodsList.concat(data)
          if (this.goodsList.length <=5 && res.data.data.currentPageDatas.length == this.pageSize) {
            this.pageIndex++
            this.getSummarys()
          }
          if (this.goodsList.length == 0) {
            this.noGoods = true
            this.isLoadmore = false
          }
          wx.hideLoading()
        }
      })
    }
  },
  mounted() {
    let queryObj = this.$root.$mp.query
    this.queryObj = queryObj
    this.groupId = queryObj.groupId
    this.goodsList = []
    this.isAllLoaded = false
    this.pageIndex = 1
    this.noGoods = false
    wx.showLoading({
      title: '加载中...'
    })
    if (queryObj.disableProducts) {
      this.disableProductList = queryObj.disableProducts.split(',')
    }
    if (queryObj.enableProducts) {
      this.enableProductList = queryObj.enableProducts.split(',')
      this.getList(this.enableProductList.splice(0, 10))
    } else {
      this.getSummarys()
    }
    if (queryObj.groupName == 'undefined' || queryObj.groupName == '') {
      queryObj.groupName = '分类名'
    }
    wx.setNavigationBarTitle({
      title: queryObj.groupName
    })
  },
  onReachBottom() {
    if (this.queryObj.enableProducts) {
      this.getList(this.enableProductList.splice(0, 10))
    } else {
      this.pageIndex++
      if (!this.isAllLoaded) {
        this.getSummarys()
      }
    }
  }
}
</script>

<style lang="scss">
.goods-list-container{
  background: #f0f0f0;
  height: 100%;
  box-sizing: border-box;
  .search-header{
    height: 80rpx;
    box-sizing: border-box;
    padding: 12rpx 24rpx 12rpx 32rpx;
    .search-header-content{
      position: relative;
      .icon-mpmall{
        position: absolute;
        color: #353535;
        font-size: 28rpx;
        z-index: 100;
        left: 20rpx;
        top: 14rpx;
      }
      input{
        width: 620rpx;
        line-height: 58rpx;
        height: 58rpx;
        padding-left: 70rpx;
        display: inline-block;
        box-sizing: border-box;
        background: #fff;
        border-radius: 8rpx;
      }
      .cancel-text{
        line-height: 58rpx;
        display: inline-block;
        font-size: 26rpx;
        color: #888888;
        vertical-align:top;
        margin-left:22rpx;
      }
    }
  }
  .no-goods{
    text-align: center;
    padding-top: 78rpx;
    p{
      color:#353535;
      font-size:28rpx;
    }
    span{
      color: #353535;
      font-size: 28rpx;
    }
    image{
      width: 180rpx;
      height: 180rpx;
      display: block;
      margin: 0 auto 30rpx auto;
      color: #ccc;
    }
  }
  @keyframes bouncing-loader {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0.1;
      transform: translateY(-10rpx);
    }
  }
  .bouncing-loader {
    display: flex;
    justify-content: center;
  }
  .bouncing-loader > div {
    width: 10rpx;
    height: 10rpx;
    margin: 30rpx 2rpx;
    background: #8385aa;
    border-radius: 50%;
    animation: bouncing-loader 0.6s infinite alternate;
  }
  .bouncing-loader > div:nth-child(2) {
    animation-delay: 0.2s;
  }
  .bouncing-loader > div:nth-child(3) {
    animation-delay: 0.4s;
  }
  .no-more{
    line-height: 84rpx;
    background: #f0f0f0;
    text-align: center;
    color: #909090;
    font-size: 22rpx;
  }
  .goods-list{
    padding: 20rpx 34rpx 0 34rpx;
    box-sizing: border-box;
    background: #fff;
    .goods-item{
      display: block;
      height: 220rpx;
      margin-bottom: 36rpx;
      image{
        float: left;
        width: 206rpx;
        height: 206rpx;
        border-radius: 8rpx;
      }
      .goods-info{
        margin-left: 228rpx;
        padding-top: 8rpx;
        height: 206rpx;
        box-sizing: border-box;
      }
      .goods-name{
        height: 110rpx;
        font-size: 26rpx;
        color: #353535;
        span{
          height: 54rpx;
          text-overflow: ellipsis;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .goods-price{
        color: #fa5f62;
      }
      .reality-price{
        text-decoration: line-through;
        font-size: 12px;
        color: #b2b2b2;
      }
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
}
</style>
