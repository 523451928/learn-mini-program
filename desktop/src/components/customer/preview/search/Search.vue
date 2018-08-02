<template>
  <div>
    <div class="search-header">
      <div class="search-header-content">
        <span class="el-icon-search"></span>
        <input type="text" autofocus="autofocus" v-model="queryStr" @keyup.enter="searchFn">
        <span class="cancel-text" @click="back">取消</span>
      </div>
    </div>
    <div class="search-list-container">
      <div class="goods-list clearfix" v-show="goodsList.length">
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
                  <span>￥{{item.maxSkuPrice}}</span>
                </p>
                <p class="reality-price">￥{{item.maxSkuPrice}}</p>
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
      pageIndex: 1,
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
    back() {
      this.$router.go(-1)
    },
    searchFn() {
      this.pageIndex = 1
      this.goodsList = []
      this.loadmoreInstance.refresh()
      this.getSummarys()
    },
    getSummarys() {
      this.loadmoreInstance.trigger('changeBottomStatus', 'loading')
      // this.$loading('加载中...')
      this.loadVisible = true
      this.$http.get('/api/product/summarys', {
        params: {
          Title: this.queryStr,
          storeId: localStorage.getItem('storeId'),
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
          } else {
            this.isAllLoaded = false
          }
          // this.$loading.close()
        })
        if (this.goodsList.length == 0) {
          this.noGoods = true
        } else {
          this.noGoods = false
        }
        this.isLoadmore = false
      })
    }
  },
  mounted() {
    this.setNavBar(false)
    this.goodsList = []
    this.isAllLoaded = false
    this.pageIndex = 1
    this.noGoods = false
    this.loadmoreInstance = new Loadmore({
      el: document.querySelector('.search-list-container'),
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
      autoFill: false,
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
          this.getSummarys()
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
.search-header {
    height: .80rem;
    width: 100%;
    box-sizing: border-box;
    padding: .12rem .24rem .12rem .32rem;
    position: fixed;
    z-index: 100;
    background:#f5f5f5;
    top: 0;
    left: 0;
    font-size: 14px;
    .search-header-content{
      position: relative;
      .el-icon-search{
        position: absolute;
        color: #353535;
        font-size: .28rem;
        z-index: 100;
        left: .20rem;
        top: .14rem;
      }
      input{
        width: 6rem;
        line-height: .58rem;
        height: .58rem;
        padding-left: .70rem;
        display: inline-block;
        box-sizing: border-box;
        background: #fff;
        border: none;
        outline: none;
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
.search-list-container{
  padding-top: .8rem;
  background: #fff;
  min-height: 100%;
  font-size: 14px;
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
          height: .7rem;
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
