<template>
  <div class="container search-container">
    <div class="search-header">
      <div class="search-header-content">
        <text class="iconfont icon-mpmall">&#xe637;</text>
        <input type="text" confirm-type="search" :focus="true" v-model="queryStr" @confirm="confirmSearch">
        <span class="cancel-text" @click="back">取消</span>
      </div>
    </div>
    <view class="goods-list clearfix" v-show="goodsList.length">
      <view v-for="(item, index) in goodsList" :key="index" class='goods-item'>
        <view>
          <a :href="'/pages/goodsdetail/main?productId='+item.productId">
            <image :lazy-load="ture" :src="item.pictureUris[0]"/>
            <div class="goods-info">
              <p class="goods-name">
                <span>{{item.title}}</span>
              </p>
              <p class="goods-price">
                <span>￥{{item.rangePrice}}</span>
              </p>
              <p class="reality-price">￥{{item.minSkuRealityPrice}}</p>
            </div>
          </a>
        </view>
      </view>
      <mp-loading v-if="!isAllLoaded" :loadVisible="isLoadmore"></mp-loading>
    </view>
    <div class="no-goods" v-if="noGoods">
      <!-- <text class="icon-mpmall">&#xe63a;</text> -->
      <image :src="noGoodsImg" />
      <span>未搜索到相关商品</span>
    </div>
    <div v-if="isAllLoaded && !noGoods" class="no-more">-没有更多商品了-</div>
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
      queryStr: '',
      isLoadmore: false,
      isAllLoaded: false,
      noGoods: false,
      pageSize: 10,
      noGoodsImg: require('@/assets/img/no-goods.png')
    }
  },
  methods: {
    back() {
      wx.navigateBack()
    },
    getSummarys() {
      let self = this
      this.isLoadmore = true
      wx.request({
        url: `${baseURL}/api/product/summarys`,
        data: {
          Title: self.queryStr,
          StoreId: wx.getStorageSync('storeId'),
          pageIndex: self.pageIndex,
          pageSize: self.pageSize
        },
        success(res) {
          let data = res.data.data.currentPageDatas
          self.goodsList = self.goodsList.concat(data)
          self.goodsList.forEach((item) => {
            let rangePrice = ''
            if (item.maxSkuPrice == item.minSkuPrice) {
              rangePrice = item.maxSkuPrice
            } else {
              rangePrice = item.minSkuPrice + '-' + item.maxSkuPrice
            }
            self.$set(item, 'rangePrice', rangePrice)
          })
          if (data.length == 0 || data.length < self.pageSize) {
            self.isAllLoaded = true
            self.isLoadmore = false
          }
          if (self.goodsList.length == 0) {
            self.noGoods = true
          } else {
            self.noGoods = false
          }
        }
      })
    },
    confirmSearch() {
      this.isAllLoaded = false
      this.pageIndex = 1
      this.goodsList = []
      this.getSummarys()
    }
  },
  mounted() {
    this.pageIndex = 1
    this.goodsList = []
    this.isLoadmore = false
    this.isAllLoaded = false
    // this.getSummarys()
  },
  onReachBottom() {
    this.pageIndex++
    if (!this.isAllLoaded) {
      this.getSummarys()
    }
  }
}
</script>

<style lang="scss">
.search-container{
  background: #f0f0f0;
  .search-header{
    height: 80rpx;
    box-sizing: border-box;
    padding: 12rpx 24rpx 12rpx 32rpx;
    position:fixed;
    top:0;
    background:#f5f5f5;
    .search-header-content{
      position: relative;
      .icon-mpmall{
        position: absolute;
        color: #353535;
        font-size: 28rpx;
        z-index: 100;
        left: 20rpx;
        top: 16rpx;
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
    span{
      color: #353535;
      font-size: 28rpx;
    }
    image{
      width: 180rpx;
      height: 180rpx;
      display: block;
      padding-top: 160rpx;
      margin: 0 auto 30rpx auto;
    }
    .icon-mpmall{
      font-size: 180rpx;
      display: block;
      margin: 78rpx auto 30rpx auto;
      color: #ccc;
    }
  }
  .no-more{
    line-height: 84rpx;
    background: #f0f0f0;
    text-align: center;
    color: #909090;
    font-size: 22rpx;
  }
  .goods-list{
    // min-height: 100%;
    padding: 100rpx 34rpx 0 34rpx;
    box-sizing: border-box;
    background: #fff;
    .goods-item{
      display: block;
      height: 220rpx;
      margin-bottom: 46rpx;
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
