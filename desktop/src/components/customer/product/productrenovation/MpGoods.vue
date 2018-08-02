<template>
  <div class="goods-container" @click="changeComponent">
    <el-popover
      placement="top"
      width="170"
      v-model="popVisible">
      <p style="text-align: center; margin-top: 10px">确定删除商品列表组件吗？</p>
      <div style="text-align: center; margin: 10px">
        <el-button size="mini" round @click="popVisible = false">取消</el-button>
        <el-button round type="primary" size="mini" @click="deleteComponent">确定</el-button>
      </div>
      <span slot="reference" class="delete-btn">
        <span class="el-icon-delete"></span>删除
      </span>
    </el-popover>
    <div class="goods-title" v-show="goodsObj.titleVisible">
      {{goodsObj.title}} 
      <span class="fr">
        更多<span class="el-icon-arrow-right"></span>
      </span>
    </div>
    <div class="goods-list-a" v-show="goodsObj.goodsStyle == 'styleA'">
      <ul>
        <li v-for="(item, index) in goodsObj.goodsList" :key="index">
          <img v-if="item.pictureUris[0]" v-lazy="item.pictureUris[0]" alt="">
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
        <li v-for="(item, index) in goodsObj.goodsList" :key="index">
          <img v-if="item.pictureUris[0]" v-lazy="item.pictureUris[0]" alt="">
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
        <li v-for="(item, index) in goodsObj.goodsList" :key="index">
          <div class="fl">
            <img v-if="item.pictureUris[0]" v-lazy="item.pictureUris[0]" alt="">
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
import { mixins } from './mixins'
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
  data() {
    return {
      popVisible: false
    }
  }
}
</script>

<style lang="scss">
  .goods-container{
    position: relative;
    padding: 6px;
    background: #fff;
    margin-bottom: 10px;
    .goods-title{
      line-height: 30px;
      width: 100%;
      height: 30px;
      font-size: 15px;
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
          width: 120px;
          height: 120px;
          border-radius: 4px;
        }
        .occupy-span{
          display: inline-block;
          width: 120px;
          height: 102px;
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
          height: 250px;
          border-radius: 4px;
        }
        .goods-name{
          margin: 5px 0;
          font-size: 12px;
          text-align: left;
          color: #4b4b4b;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
        height: 80px;
        padding: 2px 0;
        img{
          width: 70px;
          height: 70px;
          border-radius: 4px;
        }
        .goods-info{
          height: 100%;
          margin-left: 76px;
          .goods-name{
            font-size: 12px;
            height: 32px;
            color: #353535;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .goods-price{
            color: #fa5f62;
            font-size: 12px;
          }
          .reality-price{
            text-decoration: line-through;
            font-size: 10px;
            color: #b2b2b2;
          }
        }
      }
    }
    .delete-btn{
      display: inline-block;
      position: absolute;
      cursor: pointer;
      padding: 3px 8px;
      right: 7px;
      top: 7px;
      z-index: 1000;
      display: none;
      color: #fff;
      font-size: 12px;
      border-radius: 12px;
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
