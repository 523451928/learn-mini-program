<template>
  <div class="goods-list-container">
    <div class="goods-list clearfix">
      <div v-for="(item, index) in goodsList" :key="index" class='goods-item'>
        <div @click="toGoodsDetail(item)">
          <a href="javascript:void(0);">
            <img :src="item.pictureUris[0]" />
            <div class="goods-info">
              <p class="goods-name">
                <span>
                  {{item.title}}
                </span>
              </p>
              <p class="goods-price">
                <span>￥{{item.minSkuPrice}}</span>
              </p>
              <p class="reality-price">￥{{item.minSkuRealityPrice}}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
    <div class="no-goods" v-if="noGoods">
      <img :src="noGoodsImg" />
      <p>未搜索到相关商品</p>
    </div>
    <div class="bouncing-loader" :class="{'visible' : loadVisible}" v-if="!isAllLoaded">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-if="isAllLoaded && goodsList.length" class="no-more">-没有更多商品了-</div>
  </div>
</template>

<script>
import Loadmore from '@/assets/js/loadmore'
import { mapMutations } from 'vuex'
import { mixins } from '../mixins'
export default {
  mixins: [ mixins ],
  data () {
    return {
      goodsList: [],
      pageIndex: 0,
      queryStr: '',
      isLoadmore: false,
      isAllLoaded: false,
      loadVisible: false,
      noGoods: false,
      groupId: '',
      pageSize: 6,
      noGoodsImg: require('@/assets/imgs/no-goods.png'),
      loadmoreInstance: null
    }
  },
  methods: {
    ...mapMutations([
      'setNavBar'
    ]),
     getList(list) {
      let productList = this.goodsList
      let promise = Promise.resolve(productList)
      this.isLoadmore = true
      list.forEach(item => {
        promise = promise.then(() => {
          return new Promise((resolve => {
           this.$http.get(`/api/product?id=${item}`).then((res) => {
              resolve()
              let data = res.data.data
              let priceArr = data.skus.map(sku => sku.price)
              let realityPriceArr = data.skus.map(sku => sku.realityPrice)
              this.$set(data, 'minSkuPrice', Math.min.apply(null, priceArr))
              this.$set(data, 'minSkuRealityPrice', Math.min.apply(null, realityPriceArr))
              productList.push(data)
            })
          }))
        })
      })
      if (!this.enableProductList.length) {
        this.isAllLoaded = true
        this.isLoadmore = false
      }
      this.goodsList = productList
      return promise
    },
    getSummarys() {
      this.loadmoreInstance.trigger('changeBottomStatus', 'loading')
      // this.$loading('加载中...')
      this.loadVisible = true
      this.$http.get('/api/product/summarys', {
        params: {
          Title: this.queryStr,
          StoreId: localStorage.getItem('storeId'),
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          groupId: this.groupId
        }
      }).then((res) => {
        let data = res.data.data.currentPageDatas
        this.goodsList = this.goodsList.concat(data)
        this.loadmoreInstance.trigger('changeBottomStatus', 'pull')
        this.loadVisible = false
        this.$nextTick(() => {
          this.loadmoreInstance.onBottomLoaded()
          if (data.length == 0 || data.length < this.pageSize) {
            this.loadmoreInstance.destroy()
            this.isAllLoaded = true
          }
          // this.$loading.close()
        })
        if (this.goodsList.length == 0) {
          this.noGoods = true
          document.querySelector('body').style.background = '#fff'
        } else {
          document.querySelector('body').style.background = '#f0f0f0'
        }
        this.isLoadmore = false
      })
    }
  },
  mounted() {
    this.setNavBar(false)
    let queryObj = this.$router.currentRoute.query
    this.queryObj = queryObj
    this.groupId = queryObj.groupId
    this.goodsList = []
    this.isAllLoaded = false
    this.pageIndex = 1
    this.noGoods = false
    document.title = queryObj.groupName || '分类名'
    if (queryObj.disableProducts) {
      this.disableProductList = queryObj.disableProducts.split(',')
    }
    if (queryObj.enableProducts) {
      this.enableProductList = queryObj.enableProducts.split(',')
    }
    this.groupId = this.$router.currentRoute.query.groupid
    this.goodsList = []
    this.isAllLoaded = false
    this.pageIndex = 0
    this.noGoods = false
    this.loadmoreInstance = new Loadmore({
      el: document.querySelector('.goods-list-container'),
      scrollLoad: true,
      topDistance: 50,
      bottomDistance: 50,
      distanceIndex: 2,
      topPullText: '下拉刷新',
      topDropText: '释放更新',
      topLoadingText: '更新中...',
      bottomPullText: '上拉加载更多',
      bottomDropText: '释放更新',
      bottomLoadingText: '更新中...',
      noMoreText: '没有更多了...',
      autoFill: true,
      sideSlipDisabled: false,
      elasticRolling: false,
      scrollDirection: 'vertical',
      preLoadDistance: 50,
      topMethod: () => {
        this.loadmoreInstance.onTopLoaded()
      },
      bottomMethod: () => {
        this.pageIndex++
        if (!this.isAllLoaded && !this.isLoadmore) {
          this.isLoadmore = true
          if (this.enableProductList) {
            this.getList(this.enableProductList.splice(0, 10))
          } else {
            this.getSummarys()
          }
        }
      }
    })
  },
  destroyed() {
    this.loadmoreInstance.unbindEvent()
  }
}
</script>

<style lang="scss">
.loadmore-wrapper{
  overflow: hidden;
}

.wa-loadmore-top {
  margin-top: -50px;
  line-height: 50px;
  text-align: center;
}
.wa-loadmore-bottom {
  margin-bottom: -50px;
  line-height: 50px;
  text-align: center;
}
.wa-nomore-text{
  line-height: 50px;
  text-align: center;
  display: none;
}
.mp-container{
  overflow: hidden;
  height: auto;
}
.goods-list-container{
  background: #fff;
  min-height: 100%;
  font-size: 14px;
  .search-header{
    height: .80rem;
    box-sizing: border-box;
    padding: .12rem .24rem .12rem .32rem;
    .search-header-content{
      position: relative;
      .icon-mpmall{
        position: absolute;
        color: #353535;
        font-size: .28rem;
        z-index: 100;
        left: .20rem;
        top: .14rem;
      }
      input{
        width: 6.20rem;
        line-height: .58rem;
        height: .58rem;
        padding-left: .70rem;
        display: inline-block;
        box-sizing: border-box;
        background: #fff;
        border-radius: .08rem;
      }
      .cancel-text{
        line-height: .58rem;
        display: inline-block;
        font-size: .26rem;
        color: #888888;
        vertical-align:top;
        margin-left:.22rem;
      }
    }
  }
  .no-goods{
    text-align: center;
    span{
      color: #353535;
      font-size: .28rem;
    }
    img{
      width: 1.80rem;
      height: 1.80rem;
      display: block;
      margin: .78rem auto .30rem auto;
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
      transform: translateY(-.10rem);
    }
  }
  .bouncing-loader {
    display: flex;
    justify-content: center;
    visibility: hidden;
  }
  .visible{
    visibility: visible;
  }
  .bouncing-loader > div {
    width: .10rem;
    height: .10rem;
    margin: .30rem .06rem;
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
    line-height: .84rem;
    background: #f0f0f0;
    text-align: center;
    color: #909090;
    font-size: .22rem;
  }
  .goods-list{
    padding: .10rem .34rem 0 .34rem;
    box-sizing: border-box;
    background: #fff;
    .goods-item{
      display: block;
      height: 2.20rem;
      margin-bottom: .46rem;
      img{
        float: left;
        width: 2.06rem;
        height: 2.06rem;
        border-radius: .08rem;
      }
      .goods-info{
        margin-left: 2.28rem;
        padding-top: .08rem;
        height: 2.06rem;
        box-sizing: border-box;
      }
      .goods-name{
        height: 1.10rem;
        font-size: .26rem;
        color: #353535;
        span{
          height: .76rem;
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
