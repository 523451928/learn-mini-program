<template>
  <div class="container">
    <div v-for="(item, index) in componentList" :key="index" >
      <mp-goods v-if="item.name == 'MpGoods'" :title="item.title" :goodsObj="item.goodsObj"></mp-goods>
      <mp-category v-if="item.name == 'MpCategory'"  :categoryList="item.categoryList"></mp-category>
      <mp-coupon v-if="item.name == 'MpCoupon'" :couponList="item.couponList"></mp-coupon>
      <swiper v-if="item.name == 'MpSwiper'" class="mp-swiper" :indicator-dots="indicatorDots"
        :autoplay="autoplay" :interval="interval" :circular="true" :duration="duration" :style="{ height: item.height * 2 + 'rpx' }"
        :indicatorColor="indicatorColor" :indicatorActiveColor="indicatorActiveColor">
        <block v-for="(itm, idx) in item.imgArr" :key="idx" >
          <swiper-item class="mp-swiper">
            <a :href="'/pages/goodsdetail/main?productId='+itm.href">
              <image :src="itm.url || defaultImg" class="slide-image" mode="widthFix"/>
            </a>
          </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="copyright">
      <p>由友店提供技术支持</p>
      <img src="../../assets/img/gray-logo.png" alt="">
    </div>
    <!-- <button open-type="getUserInfo" lang="zh_CN" bindgetuserinfo="onGotUserInfo">登录</button> -->
  </div>
</template>

<script>
import store from '@/store/store'
import { baseURL } from '@/utils/index'
import { config } from '@/assets/json/configuration'
import MpGoods from '@/components/index/Mpgoods'
import MpCategory from '@/components/index/MpCategory'
import MpCoupon from '@/components/index/MpCoupon'

export default {
  data () {
    return {
      defaultImg: require('@/assets/img/slider-default.png'),
      componentList: {},
      indicatorDots: true,
      indicatorColor: '#dee1e5',
      indicatorActiveColor: '#fa5f62',
      autoplay: true,
      interval: 5000,
      duration: 500
    }
  },
  components: {
    MpGoods,
    MpCoupon,
    MpCategory
  },
  methods: {
    
  },
  onShareAppMessage: (res) => {
    return {
      title: store.state.shareInfo.description,
      path: '/pages/index/main',
      imageUrl: store.state.shareInfo.pictureUri
    }
  },
  onLoad(options) {
    let scene = decodeURIComponent(options.scene)
    if (scene && scene.productId) {
      wx.navigateTo({
        url: `/pages/goodsdetail/main?productId=${scene.productId}`
      })
    }
  },
  computed: {
    storeName() {
      return store.state.storeInfo.storeName
    }
  },
  watch: {
    storeName(title) {
      wx.setNavigationBarTitle({
        title
      })
    }
  },
  mounted() {
    wx.$http({
      url: `${baseURL}/api/wechat/miniapp/forwardsetting/${wx.getStorageSync('storeId')}`,
      success: (res) => {
        store.commit('setShareInfo', res.data.data)
        let shareInfo = store.state.shareInfo
        if (shareInfo.isEnable && shareInfo.scopes.indexOf('HomeIndex') != -1) {
          wx.showShareMenu()
        } else {
          wx.hideShareMenu()
        }
      }
    })
    if (store.state.storeInfo.storeName) {
      wx.setNavigationBarTitle({
        title: store.state.storeInfo.storeName
      })
    }
    let configuration = store.state.configuration
    if (configuration.customComponetList) {
      this.componentList = configuration.customComponetList
    } else {
      this.componentList = config.customComponetList
    }
  }
}
</script>

<style lang="scss">
page{
  background: #f5f5f5;
  overflow-x: hidden;
}
view{
  width: 100%;
  .mp-swiper{
    width: 100%;
    image{
      width: 100%;
    }
  }
  .copyright{
    text-align: center;
    padding: 20rpx 0 40rpx 0;
    p{
      font-size: 24rpx;
      color: #ccc;
    }
    img{
      width: 70rpx;
      height: 42rpx;
      margin-top: 15rpx;
    }
  }
}
</style>
