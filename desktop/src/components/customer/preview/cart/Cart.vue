<template>
  <div class="cart-container">
    <ul class="container" v-if="cartList.length > 0">
      <li v-for="(item, index) in cartList" :key="index" :class="{'translate-item': item.isTranslate}" class="cart-item" @touchstart="itemStart($event, item)" @touchmove="itemMove" @touchend="itemEnd($event, item)">
        <div class="checkbox-container">
          <span class="checkbox" @click="toggleCheck(item)" :class="{'checked': item.checked, 'disabled-checkbox': item.invalid}"></span>
        </div>
        <div class="goods-detail">
          <img v-lazy="item.imgUrl" @click="toGoodsDetail(item)">
          <img class="invalid-img" v-if="item.invalid" src="../../../../assets/imgs/invalid-goods.png" @click="toGoodsDetail(item)">
          <div class="goods-info">
            <p class="goods-title">{{item.title}}</p>
            <p class="goods-spec">
              <span v-for="(spec, idx) in item.sku.specifications" :key="idx">
                {{spec.name}}:{{spec.value}}
              </span>
            </p>
            <div class="price-box">
              <span class="price">￥{{item.sku.price}}</span>
              <span class="reality-price">￥{{item.sku.realityPrice}}</span>
              <input-count v-if="!item.invalid" :count="item.count" @minusFn="minusFn(item, index)" @plusFn="plusFn(item, index)" @changeItem="changeItem(item, index)" @changeCount="changeCount" :maxCount="item.sku.stock"></input-count>
            </div>
            <!-- <span class="delete-btn" @click="deleteCart(item, index)">删除</span> -->
          </div>
        </div>
        <div class="sider-btn" @click="deleteCart(item, index, true)">
          删除
        </div>
      </li>
    </ul>
    <div class="empty-cart" v-else>
      <img :src="emptyImg" alt="">
      <p>购物车空空如也</p>
      <p class="small-text">去逛逛吧</p>
    </div>
    <div class="settle-bar" v-if="cartList.length">
      <span class="all-check" @click="toggleAllChecked" :class="{'checked': isAllChecked}"></span>
      <span class="check-text">全选</span>
      <span class="total-money fr">
        <span>合计:</span>￥{{totalMoney}}
      </span>
      <span class="settle-btn" @click="settleFn" :class="{'disabled': totalCount == 0}">
        去结算({{totalCount}})
      </span>
    </div>
  </div>
</template>

<script>
import { baseURL, formatCartList, getSlideDirection } from '@/assets/js/utils'
import { mapMutations } from 'vuex'
import { mixins } from '../mixins'
import InputCount from '@/components/public/InputCount'
export default {
  mixins: [ mixins ],
  components: {
    InputCount
  },
  data () {
    return {
      productList: [],
      cartList: [],
      goodsList: [],
      itemTouch: {},
      currentItem: {},
      cacheObj: {},
      emptyImg: require('@/assets/imgs/cart-empty.png')
    }
  },
  methods: {
    ...mapMutations([
      'setNavBar'
    ]),
    settleFn() {
      return
      if (this.checkedGoods.length > 0) {
        const url = '/pages/enterorder/main'
        let arr = this.checkedGoods
        let map = {},
          freightArr = [];
        for (let i = 0; i < arr.length; i++) {
          let ai = arr[i]
          if (!map[ai.freightTemplateId]) {
            freightArr.push({
              freightTemplateId: ai.freightTemplateId,
              freightValue: { volume: ai.sku.volume * ai.count, weight: ai.sku.weight * ai.count }
            })
            map[ai.freightTemplateId] = ai
          } else {
            for (let j = 0; j < freightArr.length; j++) {
              let dj = freightArr[j]
              if (dj.freightTemplateId == ai.freightTemplateId) {
                dj.freightValue.volume += ai.sku.volume * ai.count
                dj.freightValue.weight += ai.sku.weight * ai.count
                break;
              }
            }
          }
        }
        wx.navigateTo({ url })
      }
    },
    itemStart(e, item) {
      this.itemTouch.disX = 0
      this.cartList.forEach((cart) => {
        if (JSON.stringify(cart) != JSON.stringify(item)) {
          this.$set(cart, 'isTranslate', false)
        }
      })
      this.itemTouch.isStart = true
      this.itemTouch.startX = e.touches[0].clientX
      this.itemTouch.startY = e.touches[0].clientY
    },
    itemMove(e) {
      if (this.itemTouch.isStart) {
        let moveX = e.touches[0].clientX
        let moveY = e.touches[0].clientY
        let direction = getSlideDirection(this.itemTouch.startX, this.itemTouch.startY, moveX, moveY)
        if (direction === 1 || direction === 2) {
          return false
        }
        this.itemTouch.disX = moveX - this.itemTouch.startX
        if (this.itemTouch.disX > 20) {
          return
        }
        if (this.itemTouch.disX < -80) {
          this.itemTouch.disX = -80
        }
      }
    },
    itemEnd(e, item) {
      if (this.itemTouch.disX < -40 || item.isTranslate) {
        this.$set(item, 'isTranslate', true)
      }
      if (this.itemTouch.disX > 10) {
        this.$set(item, 'isTranslate', false)
      }
    },
    deleteCart(item, index, confirm) {
      if (confirm) {
        this.cartList.splice(index, 1)
        this.goodsList.splice(index, 1)
        localStorage.setItem('goodsList', JSON.stringify(this.goodsList))
      } else {
        this.$confirm(
          {
            title: '请确认',
            btnArr: [
              {
                text: '取消',
                callback() {
                },
                className: 'cancel'
              },
              {
                text: '确认',
                callback: () => {
                  this.cartList.splice(index, 1)
                },
                className: 'confirm'
              }
            ]
          }
        )
      }
    },
    toggleAllChecked() {
      if (!this.isAllChecked) {
        this.cartList.forEach((item) => {
          item.checked = true
        })
      } else {
        this.cartList.forEach((item) => {
          item.checked = false
        })
      }
    },
    toggleCheck(item) {
      item.checked = !item.checked
    },
    minusFn(item, index) {
      item.count--
      this.modifyGoodsCount(item, index)
    },
    plusFn(item, index) {
      item.count++
      this.modifyGoodsCount(item, index)
    },
    changeItem(item, index) {
      this.currentItem = item
      this.currentIndex = index
    },
    changeCount(val) {
      this.currentItem.count = val
      this.modifyGoodsCount(this.currentItem, this.currentIndex)
    },
    modifyGoodsCount(item, index) {
      this.goodsList[index].count = item.count
      localStorage.setItem('goodsList', JSON.stringify(this.goodsList))
    },
    toDetail(item) {
      const url = '/pages/detail/main?productId='+item.productId
    },
    getList(list) {
      let productList = []
      let promise = Promise.resolve(productList)
      list.forEach(item => {
        promise = promise.then(() => {
          return new Promise((resolve => {
            if (this.cacheObj[item.productId]) {
              productList.push(this.cacheObj[item.productId])
              resolve()
            } else {
              this.$http.get(`${baseURL}/api/product?id=${item.productId}`).then((res) => {
                if (res.status == 200) {
                  this.cacheObj[item.productId] = res.data.data
                  productList.push(res.data.data)
                } else {
                  productList.push({
                    title: item.productName,
                    pictureUris: [item.productPictureUri],
                    sku: {
                      specifications: item.specifications,
                      price: item.price,
                      realityPrice: item.realityPrice
                    }
                  })
                }
                resolve()
              })
            }
          }))
        })
      })
      this.productList= productList
      return promise
    },
    getCartList() {
      // this.$loading.open('加载中...',{})
      let cartList = localStorage.getItem('goodsList') ? JSON.parse(localStorage.getItem('goodsList')) : []
      this.goodsList = cartList
      let map = {}
      let formatArr = []
      for (let i = 0;i < cartList.length;i++) {
        let ai = cartList[i]
        if (!map[ai.skuId]) {
          formatArr.push(ai)
          map[ai.skuId] = ai
        } else {
          for (let j = 0; j < formatArr.length; j++) {
            let dj = formatArr[j]
            if (dj.skuId == ai.skuId) {
              dj.count += ai.count

              break;
            }
          }
        }
      }
      cartList = formatArr
      localStorage.setItem('goodsList', JSON.stringify(cartList))
      let cartListA = []
      let cartListB = []
      if (cartList.length > 6) {
        cartListA = cartList.slice(0, 6)
        cartListB = cartList.slice(6)
      } else {
        cartListA = cartList
      }
      if (cartList) {
        let pro = this.getList(cartListA).then((res) => {
          this.cartList = this.cartList.concat(formatCartList(cartListA, this.productList))
          setTimeout(() => {
            if (cartListB && cartListB.length) {
              this.getList(cartListB).then((res) => {
                this.cartList = this.cartList.concat(formatCartList(cartListB, this.productList, this.isAllChecked))
              })
            }
          }, 800)
        })
      } 
    }
  },
  computed: {
    totalCount() {
      let count = 0
      this.cartList.forEach((item) => {
        if (item.checked && !item.invalid) {
          count += parseInt(item.count)
        }
      })
      return count
    },
    totalMoney() {
      let money = 0
      this.cartList.forEach((item) => {
        if (item.checked && !item.invalid) {
          money += parseFloat(item.sku.price) * item.count
        }
      })
      return money.toFixed(2)
    },
    checkedGoods() {
      return this.cartList.filter(item => item.checked && !item.invalid)
    },
    isAllChecked() {
      let isAllChecked = true
      let validCartList = this.cartList.filter(item => !item.invalid)
      validCartList.forEach((item) => {
        if (!item.checked) {
          isAllChecked = false
        }
      })
      if (!validCartList.length) {
        isAllChecked = false
      }
      return isAllChecked
    }
  },
  created() {
   
  },
  mounted() {
    this.setNavBar(true)
    this.getCartList()
  },
  onReachBottom() {
    
  }
}
</script>

<style lang="scss">
.cart-container{
  font-size: 14px;
  background: #fafafa;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  .empty-cart{
    padding-top: 1.76rem;
    text-align: center;
    font-size: .28rem;
    color: #353535;
    img{
      width: 1.80rem;
      height: 1.80rem;
      margin-bottom: .30rem;
    }
    .small-text{
      font-size: .26rem;
      color: #b2b2b2;
      margin-top: .14rem;
    }
  }
  .settle-bar{
    position: fixed;
    bottom: 48px;
    width: 100%;
    height: .80rem;
    line-height: .80rem;
    background: #fafafa;
    color: #333333;
    font-size: .26rem;
    border-top: 1px solid #dadada;
    z-index: 100;
    .total-money{
      margin-right: 2.20rem;
      span{
        color: #888888;
        font-size: .24rem;
      }
    }
    .settle-btn{
      display: inline-block;
      position: fixed;
      right: 0;
      bottom: 48px;
      width: 1.88rem;
      height: .80rem;
      text-align: center;
      background: #fa5f62;
      color: #fff;
      font-size: .30rem;
    }
    .disabled{
      color: #999;
      background: #d7d7d7;
    }
    .all-check{
      position:relative;
      top:.12rem;
      left:.14rem;
      margin-right: .12rem;
      width: .40rem;
      height: .40rem;
      display: inline-block;
      background: url('../../../../assets/imgs/unchecked.png') no-repeat;
      background-size: contain;
      border: .10rem solid #fafafa;
    }
    .check-text{
      position: absolute;
    }
    .checked{
      background: url('../../../../assets/imgs/checked.png') no-repeat;
      background-size: contain;
    }
  }
  .container{
     padding-bottom: 1.8rem;
     height: 100%;
     box-sizing: border-box;
     width: 100%;
     overflow-x: hidden;
     overflow-y: auto;
     .translate-item{
       transform: translateX(-1.20rem)
     }
    .cart-item{
      background: #fff;
      margin-bottom: .24rem;
      padding: .24rem .24rem .24rem 0;
      display: flex;
      transition: all .3s;
      width:100%;
      box-sizing:border-box;
      position: relative;
      .sider-btn{
        position: absolute;
        top: 0;
        right: -1.40rem;
        width: 1.40rem;
        height: 100%;
        line-height: 9;
        text-indent: .40rem;
        background: #fa5f62;
        color: #fff;
        font-size: .24rem;
      }
      .checkbox-container{
        width: .86rem;
        text-align: center;
        margin-top: .50rem;
        // vertical-align: middle;
        // line-height: 160rem;
        .checkbox{
          width: .40rem;
          height: .40rem;
          display: inline-block;
          background: url('../../../../assets/imgs/unchecked.png') no-repeat;
          background-size: contain;
          border: .10rem solid #fff;
        }
        .checked{
          background: url('../../../../assets/imgs/checked.png') no-repeat;
          background-size: contain;
        }
        .disabled-checkbox{
          background: url('../../../../assets/imgs/disable-checkbox.png');
          background-size: contain;
        }
      }
      .goods-detail{
        position: relative;
        display: flex;
        width: 90%;
        height: 1.60rem;
        .delete-btn{
          position: absolute;
          right: .08rem;
          top: 0;
          font-size: .24rem;
          color: #888888;
        }
        .num-wrap {
          top: -0.1rem;
          right:-0.12rem;
        }
        .invalid-img{
          width: 1.20rem;
          height: 1.20rem;
          position: absolute;
          left: .20rem;
          top: .20rem;
        }
        img{
          width: 1.60rem;
          height: 1.60rem;
          border-radius: .08rem;
        }
        .goods-info{
          position: relative;
          flex: 1;
          margin-left: .12rem;
          .goods-title{
            font-size: .24rem;
            color: #353535;
            width: 4.4rem;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
          }
          .goods-spec{
            height: .88rem;
            span{
              font-size: .22rem;
              color: #b2b2b2;
            }
          }
          .price-box{
            .price{
              font-size: .30rem;
              color: #fa5f62;
            }
            .reality-price{
              font-size: .20rem;
              color: #b2b2b2;
              margin-left: .04rem;
              text-decoration: line-through;
            }
          }
        }
      }
    }
  }
}
</style>
