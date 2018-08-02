<template>
  <div class="container category-container" v-if="classifyType == 'classifyB'">
    <div class="search-head">
      <div class="search-content" @click="toSearchPage">
        <text class="iconfont icon-mpmall">&#xe637;</text>
        想要什么?这里会有~
      </div>
    </div>
    <scroll-view class='nav' scroll-y :scroll-top="scrollTop" :scroll-with-animation="true" >
      <ul>
        <li v-for="(item, index) in categoryList" :key="index" @click="activeIndex = index" :class="{'active': index == activeIndex}">{{item.supName}}</li>
      </ul>
    </scroll-view>
    <scroll-view class='content-list' scroll-y >
      <ul>
        <li v-for="(item, index) in contentList" :key="index" @click="togoodsListPage(item)">
          <image :src='item.imgUrl || defaultImg' mode="scaleToFill" />
          <text>{{item.name || '分类名'}}</text>
        </li>
      </ul>
    </scroll-view>
  </div>
  <div v-else class="container category-container">
    <div class="search-head">
      <div class="search-content" @click="toSearchPage">
        <text class="iconfont icon-mpmall">&#xe637;</text>
        想要什么?这里会有~
      </div>
    </div>
    <scroll-view class='content-list-a' scroll-y >
      <ul>
        <li v-for="(item, index) in categoryList" :key="index" @click="togoodsListPage(item)">
          <image :src='item.imgUrl || defaultImg' v-if="item.imgUrl" mode="scaleToFill" />
          <image :src="defaultImg" mode="scaleToFill" v-else />
          <text>{{item.classifyName || '分类名'}}</text>
        </li>
      </ul>
    </scroll-view>
  </div>
</template>

<script>
import { config } from '@/assets/json/configuration'
import store from '@/store/store'
export default {
  data () {
    return {
      categoryList: [],
      activeIndex: 0,
      classifyType: 'classifyA',
      defaultImg: require('@/assets/img/category-default.png'),
      navItemHeight: 50
    }
  },
  components: {
  },
  methods: {
    toSearchPage() {
      const url = '/pages/search/main'
      wx.navigateTo({ url })
    },
    togoodsListPage(item) {
      let groupName = item.name || item.classifyName
      const url = `/pages/goodslist/main?groupId=${item.groupId}&groupName=${groupName}`
      wx.navigateTo({ url })
    }
  },
  computed: {
    scrollTop() {
      return this.activeIndex * this.navItemHeight
    },
    contentList() {
      if (this.categoryList && this.categoryList[this.activeIndex]) {
        return this.categoryList[this.activeIndex].children
      }
    },
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
  onShareAppMessage: (res) => {
    return {
      title: store.state.shareInfo.description,
      path: '/pages/category/main',
      imageUrl: store.state.shareInfo.pictureUri
    }
  },
  mounted() {
    let shareInfo = store.state.shareInfo
    if (shareInfo.isEnable && shareInfo.scopes.indexOf('Catalog') != -1) {
      wx.showShareMenu()
    }  else {
      wx.hideShareMenu()
    }
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        if (res.screenWidth > 375) {
          this.navItemHeight = 55
        }
      }
    })
    if (config.classifyType == 'SettingClassifyB') {
      this.categoryList = config.classifyListB
      this.classifyType = 'classifyB'
    } else {
      this.categoryList = config.classifyListA
      this.classifyType = 'classifyA'
    }
    let configuration = store.state.configuration
    if (configuration.classifyType == 'SettingClassifyB') {
      this.categoryList =  configuration.classifyListB
      this.classifyType = 'classifyB'
    } else if (configuration.classifyType == 'SettingClassifyA') {
      this.categoryList =  configuration.classifyListA
      this.classifyType = 'classifyA'
    }
    if (store.state.storeInfo.storeName) {
      wx.setNavigationBarTitle({
        title: store.state.storeInfo.storeName
      })
    }
  }
}
</script>

<style scoped lang="scss">
.category-container{
  background: #f5f5f5;
  .search-head{
    height: 6%;
    line-break: 6%;
    box-sizing: border-box;
    padding: 0 32rpx 12rpx 32rpx;
    text-align: left;
    text-indent: 8rpx;
    font-size: 24rpx;
    .search-content{
      width: 100%;
      height: 100%;
      background: #fff;
      line-height: 56rpx;
      border-radius: 8rpx;
      color: #b2b2b2;
    }
  }
  .nav{
    width: 206rpx;
    float: left;
    font-size: 12px;
    text-align: center;
    background: #f8f8f8;
    overflow: hidden;
    height: 94%;
    li{
      line-height: 100rpx;
      height: 100rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      box-sizing: border-box;
      border-bottom: 1px solid #ebebeb;
    }
    .active{
      background: #fff;
      color: #ef6668;
      box-sizing: border-box;
      font-size: 14px;
      border-left: 2px solid #ef6668;
    }
  }
  .content-list{
    padding-left: 206rpx;
    height: 94%;
    width: 100%;
    background: #fff;
    box-sizing: border-box;
    ul{
      box-sizing: border-box;
      padding: 24rpx 30rpx;
      li{
        width: 50%;
        display: inline-block;
        box-sizing: border-box;
        text-align: center;
        font-size: 12px;
        text{
          display: inline-block;
          line-height: 56rpx;
          color: #333;
          font-size: 22rpx;
          margin-bottom: 24rpx;
        }
        image{
          display: block;
          width: 206rpx;
          height: 206rpx;
          border-radius: 8rpx;
          margin: 0 auto;
        }
      }
    }
  }
  .content-list-a{
    height: 94%;
    width: 100%;
    background: #fff;
    box-sizing: border-box;
    ul{
      box-sizing: border-box;
      padding: 24rpx 30rpx;
      li{
        width: 33.3%;
        display: inline-block;
        box-sizing: border-box;
        text-align: center;
        font-size: 12px;
        text{
          display: inline-block;
          line-height: 56rpx;
          color: #333;
          font-size: 22rpx;
          margin-bottom: 24rpx;
        }
        image{
          display: block;
          width: 206rpx;
          height: 206rpx;
          border-radius: 8rpx;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
