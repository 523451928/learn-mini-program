<template>
  <div class="sku-mask" @click="hide" :class="{'sku-hide': maskVisible}" >
    <div class="sku-content" @click.stop :class="{'sku-show': skuVisible}">
      <div class="goods-info">
        <img v-if="currentPictureUri" :src="currentPictureUri" alt="">
        <div class="goods-text">
          <p class="goods-price">￥{{price}}</p>
          <p class="goods-spec">
            <span v-for="item in checkedGoods" :key="item.name">{{item.value}}/</span><span>{{count}}件</span>
          </p>
          <p class="product-stock">
            <span v-show="productStock !== ''">库存{{productStock}}件</span>
          </p>
          <span class="close-btn" @click="hide"></span>
        </div>
      </div>
      <div class="sku-wrapper" v-if="specificationArr.length">
        <div v-for="(item, index) in specificationArr" class="sku" :key="index">
          <div class="spec-name">
            {{item.specName}}
          </div>
          <p class="sku-list">
            <span @click="changeSku(item, spec)" :key="idx" class="sku-btn" :class="{'checked': spec.checked, 'disabled': spec.disabled}" v-for="(spec, idx) in item.specValues" >
              {{spec.value}}
            </span>
          </p>
        </div>
      </div>
      <div class="select-count">
        <span class="text">选择数量</span>
        <input-count :count="count" @minusFn="minusFn" @plusFn="plusFn" :maxCount="productStock" @changeCount="changeCount"></input-count>
      </div>
      <div class="foot-btn-group">
        <button class="cart-btn" @click="addCart" :class="{'disable': productStock == 0}">加入购物车</button>
        <button class="buy-btn" @click="buyNow" :class="{'disable': productStock == 0}">立即购买</button>
      </div>
    </div>
  </div>
</template>

<script>
import { difference, removeRepeat, baseURL } from '@/assets/js/utils'
import { getSkus } from './sku.js'
import { mapState, mapMutations } from 'vuex'
import InputCount from '@/components/public/InputCount'
export default {
  components: {
    InputCount
  },
  props: {
    productDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    specificationArr: {
      type: Array,
      default() {
        return {}
      }
    },
    checkedGoods: {
      type: Array,
      default() {
        return {}
      }
    },
    skus: {
      type: Array,
      default() {
        return []
      }
    },
    price: [Number, String],
    realityPrice: [Number, String],
    skuId: [Number, String],
    currentPictureUri: [Number, String],
    productId: [Number, String],
    productStock: [Number, String],
    count: [Number, String]
  },
  data() {
    return {
      skuVisible: false,
      maskVisible: true,
      cacheCount: 1,
      skuData: {},
      storeId: '',
      isInCartlist: false,
      id: 0,
      cartList: []
    }
  },
  methods: {
    ...mapMutations([
      'setCount'
    ]),
    buyNow() {
      if (this.examinALLskuSelect()) {
        this.$toast('立即购买')
        return true
      } else {
        return false
      }
    },
    addCart() {
      if (this.examinALLskuSelect()) {
        let specifications = []
        this.specificationArr.forEach((item) => {
          let obj = {
            name: item.specName
          }
          item.specValues.forEach((spec) => {
            if (spec.checked) {
              obj.value = spec.value
            }
          })
          specifications.push(obj)
        })
        let productId = this.$router.currentRoute.query.productid || 2
        let goodsDetail = {
          productId,
          specifications,
          count: this.count,
          productName: this.productDetail.title,
          productPictureUri: this.currentPictureUri,
          price: this.price,
          realityPrice: this.realityPrice,
          storeId: this.storeId,
          skuId: this.skuId
        }
        let goodsList = localStorage.getItem('goodsList') ? JSON.parse(localStorage.getItem('goodsList')) : []
        goodsList.push(goodsDetail)
        localStorage.setItem('goodsList', JSON.stringify(goodsList))
        this.$toast('加入购物车')
        let isInCartlist = this.isInCartlist
        let count
        this.cacheCount + this.count > this.productStock ? count = this.productStock : count = this.cacheCount + this.count
        if (!this.productStock) {
          this.$toast('暂无库存')
          return false
        }
        return true
      } else {
        return false
      }
    },
    examinALLskuSelect() {
      let checkedArr = this.checkedGoods.map(item => item.name)
      let specArr = this.specificationArr.map(item => item.specName)
      let diffArr = difference(checkedArr, specArr)
      if (diffArr.length > 0) {
        // let title = `请选择${diffArr[0]}`
        let title = `请选择${diffArr.join('/')}`
        this.$toast(title)
        return false
      }
      return true
    },
    minusFn() {
      if (this.count == 1 || this.count === 0) return
      // this.count--
      let count = this.count - 1
      this.setCount(count)
    },
    plusFn() {
      if (this.count >= this.productStock && this.productStock !== '') return
      // this.count++
       let count = this.count + 1
      this.setCount(count)
    },
    changeCount(val) {
      this.count = val
    },
    hide() {
      setTimeout(() => {
        this.maskVisible = true
      }, 300)
      this.skuVisible = false
      this.$emit('removeOverflow')
    },
    show() {
      setTimeout(() => {
        this.skuVisible = true
      }, 300)
      this.maskVisible = false
    },
    changeSku(itm, spec) {
      if (spec.disabled) {
        return
      }
      itm.specValues.forEach((item) => {
        if (JSON.stringify(item) != JSON.stringify(spec)) {
          item.checked = false
        }
      })
      spec.checked = !spec.checked
      if (spec.checked) {
        this.$set(itm, 'hasChecekdChild', true)
      } else {
        this.$set(itm, 'hasChecekdChild', false)
      }
      setTimeout(() => {
        let checkedStr = this.checkedGoods.map((item) => {
          return item.value
        }).sort((a, b) => {
          return a < b
        }).join(';')
        let productStock = 0
        let price = 0
        for (let key in this.skuData) {
          if (checkedStr == key) {
            let prices = this.skuData[key].prices
            let minPrice = Math.min.apply(null, prices)
            let maxPrice = Math.max.apply(null, prices)
            if (prices.length > 1 && minPrice != maxPrice) {
              price = minPrice + '-' + maxPrice
            } else {
              price = maxPrice
            }
            productStock = this.skuData[key].count
          }
        }
        this.$emit('changeSkus', price, productStock)
        let unCheckedSkus = []
        this.specificationArr.forEach((item) => {
          item.specValues.forEach((spec) => {
            this.$set(spec, 'groupId', item.specName)
            if (!spec.checked) {
              unCheckedSkus.push(spec)
            }
          })
        })
        let checkedGoods = this.checkedGoods.map((itm) => {
          return itm.value
        })
        unCheckedSkus.forEach((item) => {
          let testSkus = []
          let siblingsSelectedArr = []
          this.checkedGoods.forEach((goods) => {
            if (item.groupId == goods.groupId) {
              siblingsSelectedArr.push(goods)
            }
          })
          if(siblingsSelectedArr.length) {
            for (let j = 0;j < siblingsSelectedArr.length;j++) {
              for(var i = 0; i < checkedGoods.length; i++) {
                (checkedGoods[i] != siblingsSelectedArr[j].value) && testSkus.push(checkedGoods[i])
              }
            }
          } else {
            testSkus = checkedGoods.concat()
          }
          testSkus = testSkus.concat(item.value)
          testSkus.sort((a, b) => {
            return a < b
          })
          if (!this.skuData[testSkus.join(';')]) {
            this.$set(item, 'disabled', true)
          } else {
            this.$set(item, 'disabled', false)
          }
        })
      }, 100)
    },
    getCartList() {
      return
      this.storeId = store.state.configuration.storeId 
      wx.$http({
        url: `${baseURL}/api/basket?storeId=${this.storeId}`,
        success: (res) => {
          if (res.data.data) {
            this.cartList = res.data.data
            let isInCartlist = false
            this.cartList.forEach((item) => {
              if (item.skuId == this.skuId) {
                isInCartlist = true
                this.cacheCount = item.count
                this.id = item.id
              }
            })
            this.isInCartlist = isInCartlist
          }
        }
      })
    }
  },
  watch: {
    productStock(newVal) {
      if (this.count === 0) this.setCount(1)
      if (newVal <= this.count) this.setCount(newVal)
    },
    count(newVal) {
      this.setCount(newVal)
    },
    skuId(newVal) {
      this.getCartList()
    },
    skus(newVal) {
      let data = {}
      this.isInCartlist = false
      newVal.forEach((item) => {
        if (item.stock) {
          let key = item.specifications.map(spec => spec.value).join(';')
          data[key] = { price: item.price, count: item.stock }
        }
      })
      let skuData = getSkus(data)
      this.skuData = skuData
      this.specificationArr.forEach((item) => {
        item.specValues.forEach((spec) => {
          if (!skuData[spec.value]) this.$set(spec, 'disabled', true)
        })
      })
    }
  },
  mounted() {
    // this.getCartList()
  }
}
</script>

<style lang="scss">
.sku-mask{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0,0,0,0.6);
  transition: all 1s;
  .sku-content{
    position: absolute;
    width: 100%;
    background: #fff;
    border-top-left-radius: .16rem;
    border-top-right-radius: .16rem;
    // height: 750rem;
    max-height: 10.34rem;
    min-height: 3.28rem;
    bottom: -10.00rem;
    transition: all .3s;
    .goods-info{
      height: 2.04rem;
      box-sizing: border-box;
      border-bottom: 1px solid #f6f6f6;
      padding: .32rem;
      margin: 0;
      border-top-left-radius: .16rem;
      border-top-right-radius: .16rem;
      img{
        display: inline-block;
        width: 1.40rem;
        height: 1.40rem;
        float: left;
      }
      .goods-text{
        position: relative;
        box-sizing: border-box;
        margin-left: 1.56rem;
        .goods-price{
          font-size: .30rem;
          color: #fa5f62;
          margin-bottom: .08rem;
        }
        .goods-spec,.product-stock{
          margin-bottom: .06rem;
          span{
            font-size: .22rem;
            color: #888888;
          }
        }
      }
      .close-btn{
        position: absolute;
        display: inline-block;
        width: 24px;
        height: 24px;
        right: 0;
        top: 0;
        transform: rotate(45deg);
        margin-top: -6px;
        margin-right: -6px;
        &::after{
          content: "";
          position: absolute;
          width: 16px;
          height: 2px;
          background: #646464;
          border-radius: 2px;
          left: 50%;
          top: 50%;
          margin-top: -1px;
          margin-left: -8px;
        }
        &::before{
          content: "";
          position: absolute;
          background: #646464;
          border-radius: 2px;
          left: 50%;
          width: 2px;
          height: 16px;
          top: 50%;
          margin-top: -8px;
          margin-left: -1px;
        }
      }
    }
    .foot-btn-group{
      display: flex;
      width: 100%;
      box-sizing: border-box;
      padding: .32rem .10rem;
      button{
        width: 3.32rem;
        height: .80rem;
        line-height: .80rem;
        font-size: .30rem;
        border-radius: .40rem;
        margin: 0 .18rem;
        outline: none;
        border: none;
        color: #fff;
        &::after{
          border: none;
        }
      }
      .cart-btn{
        background: #fa9d5f;
      }
      .buy-btn{
        background: #fa5f62;
      }
    }
    .select-count{
      height: 1.14rem;
      line-height: 1.14rem;
      padding: 0 .32rem;
      box-sizing: border-box;
      border-bottom: 1px solid #f6f6f6;
      .text{
        font-size: .26rem;
        color: #323232;
      }
    }
    .sku-wrapper{
      // height: 288rem;
      height: auto;
      max-height: 4.88rem;
      min-height: 1.50rem;
      border-bottom: 1px solid #f6f6f6;
      padding-bottom: .10rem;
      overflow-y: auto;
      .sku{
        position: relative;
        margin-bottom: .10rem;
        .spec-name{
          font-size: .26rem;
          color: #323232;
        }
        .spec-name{
          padding: 0 0 0 .32rem;
          line-height: .62rem;
          margin-top: .08rem;
        }
        .sku-list{
          display: inline-block;
          padding: 0 0 0 .28rem;
          .sku-btn{
            display: inline-block;
            font-size: 12px;
            background: #f0f0f0;
            border: none;
            outline: none;
            padding:0 .15rem;
            min-width: 1.30rem;
            text-align: center;
            box-sizing: border-box;
            line-height: .56rem;
            margin-right: .10rem;
            border-radius: .28rem;
          }
          .checked{
            background: #fa5f62;
            color: #fff;
          }
          .disabled{
            background: #f5f5f5;
            color: #b2b2b2;
          }
        }
      }
    }
  }
  .sku-show{
    bottom: 0;
  }
}
.sku-hide{
  display: none;
}
</style>