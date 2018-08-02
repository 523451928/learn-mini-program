<template>
  <div class="goods-container">
    <div class="goods-title" v-show="goodsObj.titleVisible">
      {{goodsObj.title}} 
      <span class="fr" @click="toGoodsList(goodsObj)">
        更多<span class="el-icon-arrow-right"></span>
      </span>
    </div>
    <div class="goods-list-a" v-show="goodsObj.goodsStyle == 'styleA'">
      <ul>
        <li v-for="(item, index) in goodsObj.goodsList" :key="index" @click="toGoodsDetail(item)">
          <img v-if="item.pictureUris[0]" :src="item.pictureUris[0]" alt="">
          <span v-else class="occupy-span"></span>
          <p class="goods-name">{{item.title ? item.title : 'class'}}</p>
          <p class="goods-price">
            <span>
              ￥{{item.minSkuPrice.toFixed(2)}}
            </span>
            <span class="reality-price">
              ￥{{item.minSkuRealityPrice.toFixed(2)}}
            </span>
          </p>
        </li>
      </ul>
    </div>
    <div class="goods-list-b" v-show="goodsObj.goodsStyle == 'styleB'">
      <ul>
        <li v-for="(item, index) in goodsObj.goodsList" :key="index"  @click="toGoodsDetail(item)">
          <img v-if="item.pictureUris[0]" :src="item.pictureUris[0]" alt="">
          <span v-else class="occupy-span"></span>
          <p class="goods-name">{{item.title ? item.title : 'class'}}</p>
          <p class="goods-price">
            ￥{{item.minSkuPrice.toFixed(2)}}
            <span class="reality-price">
              ￥{{item.minSkuRealityPrice.toFixed(2)}}
            </span>
          </p>
        </li>
      </ul>
    </div>
    <div class="goods-list-c" v-show="goodsObj.goodsStyle == 'styleC'">
      <ul>
        <li v-for="(item, index) in goodsObj.goodsList" :key="index"  @click="toGoodsDetail(item)">
          <div class="fl">
            <img v-if="item.pictureUris[0]" :src="item.pictureUris[0]" alt="">
            <span v-else class="occupy-span"></span>
          </div>
          <div class="goods-info">
            <p class="goods-name">{{item.title ? item.title : 'class'}}</p>
            <p class="goods-price">￥{{item.minSkuPrice.toFixed(2)}}</p>
            <p>
              <span class="reality-price">
                ￥{{item.minSkuRealityPrice.toFixed(2)}}
              </span>
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mixins } from '../mixins'
export default {
  mixins: [ mixins ],
  props: {
    title: {
      type: String,
      default: ''
    },
    goodsObj: {
      type: Object,
      default() {
        return {}
      }
    },
    goodsList: {
      type: Array,
      default() {
        return [
          {
            imgUrl: '',
            categoryName: '',
            groupId: ''
          },
          {
            imgUrl: '',
            categoryName: '',
            groupId: ''
          }
        ]
      }
    }
  },
  methods: {
    initInventList(list) {
      return Array.from(list, () => {
        return {"minSkuPrice":0,"minSkuRealityPrice":0,"title":"商品名称","pictureUris": [require('@/assets/imgs/goods-default.png')]}
      })
    },
  },
  data() {
    return {

    }
  },
  mounted() {
    let goodsIds = this.goodsObj.goodsIds
    this.$set(this.goodsObj, 'goodsList', this.initInventList(goodsIds))
    let pageSize = this.goodsObj.goodsDispaly == 'all' ? 50 : this.goodsObj.goodsCount
    if (this.goodsObj.groupId) {
      this.$http.get('/api/product/summarys', {
        params: {
          pageSize,
          order: 'OrderDes',
          storeId: localStorage.getItem('storeId'),
          pageIndex: 1,
          groupId: this.goodsObj.groupId
        }
      }).then((res) => {
        this.goodsObj.goodsList = res.data.data.currentPageDatas
      })
    }
  }
}
</script>

<style lang="scss">
  .goods-container{
    position: relative;
    padding: 6px .17rem;
    background: #fff;
    margin-bottom: 10px !important;
    .goods-title{
      line-height: 40px;
      width: 100%;
      height: 40px;
      font-size: 16px;
      color: #353535;
      .fr{
        color: #b3b3b3;
        font-size: 12px;
        .el-icon-arrow-right{
          margin-top: 6px;
        }
      }
    }
    .goods-list-a{
      li{
        text-align: center;
        display: inline-block;
        width: 50%;
        img{
          display: inline-block;
          width: 3.3rem;
          height: 3.3rem;
          border-radius: 4px;
        }
        .occupy-span{
          display: inline-block;
          width: 3.3rem;
          height: 3.3rem;
          background: #ebebeb;
          border-radius: 4px;
        }
        .goods-name{
          margin: 2px 0 0 0;
          font-size: 12px;
          text-align: left;
          color: #4b4b4b;
          height: 24px;
          padding-left: 4px;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // display: -webkit-box;
          // -webkit-line-clamp: 2;
          // -webkit-box-orient: vertical;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .goods-price{
          text-align: left;
          font-weight: 500;
          font-size: 14px;
          padding-left: 4px;
          margin-bottom: 10px;
          span{
            color: #fa5f62;
          }
          .reality-price{
            text-decoration: line-through;
            font-size: 12px;
            color: #b2b2b2;
          }
        }
      }
    }
    .goods-list-b{
      li{
        margin-bottom: 10px;
        // background: #fff;
        img{
          width: 100%;
          height: 7rem;
          border-radius: 4px;
        }
        .goods-name{
          margin: 5px 0;
          font-size: 12px;
          text-align: left;
          color: #4b4b4b;
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
    .goods-list-c{
      li{
        // background: #fff;
        height: 2.1rem;
        padding: 5px 0;
        margin-bottom: 5px;
        img{
          width: 2rem;
          height: 2rem;
          border-radius: 4px;
        }
        .goods-info{
          height: 100%;
          margin-left: 2.2rem;
          .goods-name{
            height: .4rem;
            margin-bottom: .5rem;
            font-size: 14px;
            color: #353535;
            width:4.8rem;
            display:inline-block;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
          }
          .goods-price{
            color: #fa5f62;
            font-size: .3rem;
          }
          .reality-price{
            text-decoration: line-through;
            font-size: 12px;
            color: #b2b2b2;
          }
        }
      }
    }
    .delete-btn{
      display: inline-block;
      position: absolute;
      cursor: pointer;
      padding: 5px 10px;
      right: 7px;
      top: 7px;
      z-index: 1000;
      display: none;
      color: #fff;
      font-size: 12px;
      border-radius: 10px;
      background: rgba(0,0,0,0.6);
    }
    &:hover{
      .delete-btn{
        display: inline-block;
      }
      border: 1px dashed #6d6d6d;
    }
  }
</style>
