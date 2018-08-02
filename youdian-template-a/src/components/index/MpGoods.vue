<template>
  <div class="goods-wrapper">
    <view v-if="goodsObj.titleVisible" class="goods-title">
      {{goodsObj.title}}
      <span class="fr more" @click="toCategoryListPage">
        更多<text class='iconfont icon-mpmall'>&#xe638;</text>
      </span>
    </view>
    <view class='goods-list-a clearfix' v-if="goodsObj.goodsStyle == 'styleA'">
      <view v-for="(item, index) in goodsList" :key="index" class='goods-item'>
        <view>
          <a :href="'/pages/goodsdetail/main?productId='+item.productId">
            <image :src="item.pictureUris[0]" :lazy-load="ture" />
            <p class="goods-name">
              <text>{{item.title}}</text>
            </p>
            <p class="goods-price">
              <span>￥{{item.minSkuPrice}}</span><span class="reality-price">￥{{item.minSkuRealityPrice}}</span>
            </p>
          </a>
        </view>
      </view>
    </view>
    <view class='goods-list-b clearfix' v-if="goodsObj.goodsStyle == 'styleC'">
      <view v-for="(item, index) in goodsList" :key="index" class='goods-item'>
        <view>
          <a :href="'/pages/goodsdetail/main?productId='+item.productId">
            <image :src="item.pictureUris[0]" :lazy-load="ture" />
            <div class="goods-info">
              <p class="goods-name">
                <text>{{item.title}}</text>
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
    <view class='goods-list-c clearfix' v-if="goodsObj.goodsStyle == 'styleB'">
      <view v-for="(item, index) in goodsList" :key="index" class='goods-item'>
        <view>
          <a :href="'/pages/goodsdetail/main?productId='+item.productId">
            <image :src="item.pictureUris[0]" :lazy-load="ture" />
            <div class="goods-info">
              <p class="goods-name">
                <text>{{item.title}}</text>
              </p>
              <p class="goods-price">
                <span>￥{{item.minSkuPrice}}</span><span class="reality-price">￥{{item.minSkuRealityPrice}}</span>
              </p>
            </div>
          </a>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
import { baseURL, param } from '@/utils/index'
export default {
  props: {
    goodsObj: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      goodsList: [],
      defaultImg: require('@/assets/img/goods-default.png')
    }
  },
  methods: {
    getGoodsList(list) {
      let goodsList = []
      let promise = Promise.resolve(goodsList)
      list.forEach((item, index) => {
        promise = promise.then(() => {
          return new Promise((resolve => {
            wx.$http({
              url: `${baseURL}/api/product?id=${item}`,
              success: (res) => {
                let data = res.data.data
                let minSkuPrice = Math.min.apply(null, data.skus.map(item => item.price))
                let minSkuRealityPrice = Math.min.apply(null, data.skus.map(item => item.realityPrice))
                this.$set(data, 'minSkuPrice', minSkuPrice)
                this.$set(data, 'minSkuRealityPrice', minSkuRealityPrice)
                if (data) {
                  goodsList.push(data)
                  this.goodsList[index] = Object.assign(this.goodsList[index], data)
                } else {
                  goodsList.push({"minSkuPrice":0,"minSkuRealityPrice":0,"title":"商品名称","pictureUris": [this.defaultImg]})
                }
                resolve(goodsList)
              }
            })
          }))
        })
      })
      return promise
    },
    initInventList(list) {
      this.goodsList = Array.from(list, () => {
        return {"minSkuPrice":0,"minSkuRealityPrice":0,"title":"商品名称","pictureUris": [this.defaultImg]}
      })
    },
    toCategoryListPage() {
      const url = `/pages/goodslist/main?groupId=${this.goodsObj.groupId}&groupName=${this.goodsObj.title}`
      wx.navigateTo({ url })
    }
  },
  mounted() {
    let goodsIds = this.goodsObj.goodsIds
    let pageSize = this.goodsObj.goodsDispaly == 'all' ? 50 : this.goodsObj.goodsCount
    this.initInventList(goodsIds)
    wx.request({
      url: `${baseURL}/api/product/summarys`,
      data: {
        pageSize,
        order: 'OrderDes',
        storeId: wx.getStorageSync('storeId'),
        pageIndex: 1,
        groupId: this.goodsObj.groupId
      },
      success: (res) => {
        this.goodsList = res.data.data.currentPageDatas
      }
    })
    // this.getGoodsList(goodsIds).then((res) => {
      // this.goodsList = res
    // })
  }
}
</script>

<style lang="scss">
.goods-wrapper{
  background: #fff;
  width: 100%;
  overflow-x: hidden;
  margin-bottom: 20rpx;
  .goods-title{
    padding:0 34rpx;
    font-size: 34rpx;
    color:#353535;
    box-sizing: border-box;
    line-height: 92rpx;
    .more{
      color: #b3b3b3;
      font-size: 26rpx;
      .m-icon-jiantou{
        font-size: 26rpx;
      }
    }
  }
  .goods-list-c{
    padding: 0 34rpx;
    box-sizing: border-box;
    .goods-item{
      margin-bottom: 52rpx;
      image{
        width: 100%;
        height: 688rpx;
        border-radius: 8rpx;
      }
      .goods-name{
        font-size: 26rpx;
        color: #353535;
        line-height: 68rpx;
        height: 68rpx;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .goods-price{
        color: #fa5f62;
        .reality-price{
          text-decoration: line-through;
          font-size: 12px;
          color: #b2b2b2;
        }
      }
    }
  }
  .goods-list-b{
    padding: 0 34rpx;
    box-sizing: border-box;
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
        text{
          width: 440rpx;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
    }
  }
  .goods-list-a{
    padding: 0 20rpx;
    box-sizing: border-box;
    .goods-item{
      display: inline-block;
      float: left;
      padding: 10rpx;
      margin-bottom: 10rpx;
      box-sizing: border-box;
      width: 50%;
      .goods-name{
        height: 60rpx;
        font-size: 26rpx;
        line-height: 34rpx;
        padding: 10rpx 0;
        color: #353535;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .goods-price{
        font-size: 30rpx;
        span{
          color: #fa5f62;
          margin-right: 14rpx;
        }
        .reality-price{
          text-decoration: line-through;
          font-size: 12px;
          color: #b2b2b2;
        }
      }
      image{
        width: 330rpx;
        height: 330rpx;
        display: block;
        margin: 0 auto;
        border-radius: 8rpx;
      }
    }
  } 
}
.fr{
  float: right;
}

</style>