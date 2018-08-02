<template>
  <div class="category-container">
    <div class="category-list">
      <ul>
        <li v-for="(item, index) in categoryList" :key="index" @click="toCategoryListPage(item)">
          <img :src="item.imgUrl || defaultImg" alt="">
          <!-- <span v-else class="occupy-span"></span> -->
          <p>{{item.categoryName ? item.categoryName : 'class'}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    categoryList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      defaultImg: require('@/assets/img/nav-default.png')
    }
  },
  components: {
    
  },
  methods: {
    toCategoryListPage(item) {
      const url = `/pages/goodslist/main?groupId=${item.groupId}&groupName=${item.categoryName}`
      wx.navigateTo({ url })
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss">
  .category-container{
    position: relative;
    background: #fff;
    padding-top: 20rpx;
    // margin-bottom: 10px;
    .category-list{
      ul{
        display: flex;
        padding: 0 14rpx;
        box-sizing: border-box;
      }
      li{
        text-align: center;
        flex: 1;
        img{
          display: inline-block;
          width: 140rpx;
          height: 140rpx;
          border-radius: 4px;
        }
        .occupy-span{
          display: inline-block;
          width: 140rpx;
          height: 140rpx;
          background: #ebebeb;
          border-radius: 4px;
        }
        p{
          margin: 0 0 10rpx 0;
          font-size: 24rpx;
          color: #353535;
        }
      }
    }
  }
</style>