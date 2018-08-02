<template>
  <div>
    <div class="detail-container" :class="{'overflow-hidden': isShowModal}" v-if="productIsExist">
      <mp-carousel :height="height" :imgArr="productDetail.pictureUris" :isDrag="true" clientType="mobile" :duration="5000" ref="mpCarousel"></mp-carousel>
      <img class="invalid-product" src="../../../../assets/imgs/invalid-product.png" v-if="isLowerGoods" alt="">
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
          <span class='iconfont icon-mpmall el-icon-arrow-right'></span>
        </div>
        <div v-else>
          <span class="label-text">已选</span>
          <span v-for="item in checkedGoods" :key="item.name">{{item.value}} </span>
          <span>{{count}}件</span>
          <span class='iconfont icon-mpmall el-icon-arrow-right'></span>
        </div>
      </div>
      <div class="btn-groups fixed">
        <div class="bar-group">
          <div class="nav-gorup">
            <div @click="toRouter('/index')">
              <span class="iconfont icon-mpmall">&#xe634;</span>
                首页
            </div>
            <div @click="toRouter('/cart')">
              <span class="iconfont icon-mpmall">&#xe635;</span>
                购物车 
            </div>
            <!-- <div>
              <span class="iconfont icon-mpmall">&#xe636;</span>
                客服
            </div> -->
          </div>
          <div class="btn-group">
            <div class="cart-btn" :class="{'disable-cart-btn': isLowerGoods}" @click="addCart">加入购物车</div>
            <div class="buy-btn" :class="{'disable-buy-btn': isLowerGoods}" @click="buyNow">立即购买</div>
          </div>
        </div>
      </div>
      <sku-detail :specificationArr="specificationArr"  @removeOverflow="removeOverflow" ref="skuDetail" 
        :price="price" :realityPrice="realityPrice" :checkedGoods="checkedGoods" :productStock="productStock" @changeSkus="changeSkus"
        :currentPictureUri="currentPictureUri" :productDetail="productDetail" :skus="productDetail.skus" :skuId="skuId" :count="count"></sku-detail>
      <!-- <a href="/pages/counter/main" class="counter">去往Vuex示例页面</a> -->
      <div class="detail-img" v-html="productDetail.description"></div>
    </div>
    <div class="product-none" v-else>
      <img src="../../../../assets/imgs/product-none.png">
      <p>该商品已删除</p>
    </div>
  </div>
</template>

<script>
import { baseURL, removeRepeat } from '@/assets/js/utils'
import SkuDetail from './SkuDetail'
import MpCarousel from 'components/public/MpCarousel'
import { mapState, mapMutations } from 'vuex'

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
      interval: 10000,
      duration: 500,
      region: ['广东省', '广州市', '海珠区'],
      customItem: '全部',
      isShowModal: false,
      computedPrice: 0,
      skuId: '',
      height: '',
      productIsExist: true
    }
  },
  components: {
    SkuDetail,
    MpCarousel
  },
  methods: {
    ...mapMutations([
      'setCount', 'setNavBar'
    ]),
    toRouter(path) {
      this.$router.push({
        path
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
      if (!this.isLowerGoods) {
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
      if (stock) {
        this.productStock = stock
      }
    }
  },
  mounted() {
    this.height = document.documentElement.clientWidth
    this.setNavBar(false)
    this.setCount(1)
    this.$loading.open('加载中...', {})
    let productId = this.$router.currentRoute.query.productid || 2
    this.$http.get(`${baseURL}/api/product?id=${productId}`).then((res) => {
      this.selectedIndex = -1
      this.computedPrice = 0
      this.skuId = ''
      this.productDetail = res.data.data
      this.productDetail.description = this.productDetail.description.replace('<img', '<img style="max-width:100%;height:auto" ')
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
      this.$loading.close()
    }).catch((err) => {
      if (err.response.status == 404) this.productIsExist = false
      this.$loading.close()
    })
  },
  computed: {
    ...mapState([
      'count'
    ]),
    isLowerGoods() {
      if (this.productDetail.status == 2) return true
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
          if (this.computedPrice) {
            return this.computedPrice
          }
          let priceRange = this.productDetail.skus.map((item) => {
            return item.price
          })
          let minPrice = Math.min.apply(null, priceRange)
          let maxPrice = Math.max.apply(null, priceRange)
          let realityPriceRange = this.productDetail.skus.map((item) => {
            return item.realityPrice
          })
          let minRealityPrice = Math.min.apply(null, realityPriceRange)
          let maxRealityPrice = Math.max.apply(null, realityPriceRange)
          if (minRealityPrice == maxRealityPrice) {
            this.realityPrice = maxRealityPrice
          } else {
            this.realityPrice = minRealityPrice + '-' + maxRealityPrice
          }
          this.productStock = this.totalStock
          if (minPrice == maxPrice) {
            return minPrice
          }
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
    selectedIndex: {
      get() {
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
      set() {

      }
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

<style lang="scss">
.mp-container *{
  font-size: 14px;
}
.product-none{
  padding-top: 2.26rem;
  img{
    display: block;
    width: 1.8rem;
    height: 1.8rem;
    margin: 0 auto .6rem auto;
  }
  p{
    text-align: center;
    font-size: .26rem;
    color: #B3B3B3;
  }
}
.overflow-hidden{
  overflow: hidden;
  padding-bottom: 0 !important;
}
.detail-container{
  padding-bottom: 50px;
  // line-height: 1 !important;
  background: #fafafa;
  .invalid-product{
    position: absolute;
    width: 1.60rem;
    height: 1.60rem;
    left: 50%;
    top: 2.60rem;
    margin-left: -.80rem;
  }
  .goods-info{
    padding: .40rem .34rem;
    background: #fff;
    margin-bottom: .24rem;
    .goods-title{
      margin-bottom: .24rem;
      font-size: .36rem;
    }
    .price{
      font-size: .36rem;
      color: #fa5f62;
      margin-right: .18rem;
    }
    .reality-price{
      font-size: .26rem;
      color: #909090;
      text-decoration: line-through;
    }
  }
  .selected-sku{
    padding: .30rem .34rem;
    background: #fff;
    margin-bottom: .24rem;
    .icon-mpmall{
      float: right;
      font-size: .26rem;
      margin-top: .08rem;
      color: #bababa;
    }
    span{
      font-size: .26rem;
      color: #888888;
    }
    .label-text{
      font-size: .32rem;
      color: #323232;
      margin-right: .16rem;
    }
  }
  .detail-img{
    width: 100%;
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
        .iconfont{
          display: block;
          font-size: .40rem;
          margin-bottom: .02rem;
          text-align: center;
        }
        div{
          flex: 1;
          box-sizing: border-box;
          padding: .1rem 0;
          text-align: center;
          color: #353535;
          font-size: .22rem;
        }
      }
      .btn-group{
        width: 68%;
        display: flex;
        div{
          flex: 1;
          font-size: .30rem;
          text-align: center;
          line-height: 50px;
          color: #fff;
        }
        .cart-btn{
          background: #fa9d5f;
        }
        .buy-btn{
          background: #fa5f62;
        }
        .buy-btn{
          background: #fa5f62;
        }
        .disable-buy-btn{
          color: #FA9899;
        }
        .disable-cart-btn{
          color: #FABC98;
        }
      }
    }
  }
}
.sku{
  position: relative;
  margin-bottom: .10rem;
  text{
    position: absolute;
    top: .20rem;
    font-size: 12px;
    color: #999;
  }
  .sku-list{
    display: inline-block;
    padding: 0 0 0 .60rem;
    button{
      display: inline-block;
      font-size: 14px;
      background: #f3f2f8;
      width: auto;
      padding: 0 .15rem;
      line-height: .78rem;
      margin-left: .10rem;
    }
    .checked{
      background: #da4946;
      color: #fff;
    }
  }
}
</style>
