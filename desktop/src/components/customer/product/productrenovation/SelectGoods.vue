<template>
  <transition name="translate">
    <div class="mp-goods-mask" v-show="goodsVisible">
      <div class="mp-goods-container">
        <p class="mp-goods-title">
          选择商品
          <span class="el-icon-close" @click="hide"></span>
        </p>
        <div class="mp-goods-content">
          <div class="search-head">
            <!-- <span class="label-text">搜索</span> -->
            <el-input
              class="mp-input"
              placeholder="搜索商品名称/编码"
              @keyup.native.enter="getSummarys"
              v-model="queryStr">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div class="mp-goods-list">
            <table>
              <thead>
                <tr>
                  <td width="80%">商品名称</td>
                  <td width="20%">操作</td>
                </tr>
              </thead>
              <tbody v-if="goodsList.length > 0">
                <tr v-for="(item, index) in goodsList" :key="item.productId" :class="{'bg-tr': index % 2 != 0}">
                  <td>{{item.title}}</td>
                  <td>
                    <span class="mp-link" @click="chooseGoods(item)">选择</span>
                  </td>
                </tr>
              </tbody>
              <tr rowspan="2" v-else class="no-data">
                没有找到指定商品
              </tr>
            </table>
          </div>
          <div class="page-container" v-if="goodsObj.totalPageCount > 1">
            <el-pagination
              layout="prev, pager, next"
              @current-change="getSummarys"
              :current-page="goodsObj.currentPageIndex"
              :page-count="goodsObj.totalPageCount">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
   
  },
  data() {
    return {
      goodsVisible: false,
      goodsObj: {},
      goodsList: [],
      queryStr: '',
      pageIndex: 1
    }
  },
  methods: {
    show() {
      this.goodsVisible = true
    },
    hide() {
      this.goodsVisible = false
    },
    chooseGoods(item) {
      this.$emit('selectGoods', item)
      this.hide()
    },
    getSummarys(index) {
      if (typeof index == 'number') {
        this.pageIndex = index
      } else {
        this.pageIndex = 1
      }
      this.$http.get('/api/product/summarys', {
        params: {
          Title: this.queryStr,
          StoreId: localStorage.getItem('storeId'),
          pageIndex: this.pageIndex,
          pageSize: 8
        }
      }).then((res) => {
        this.goodsObj = res.data.data
        this.goodsList = this.goodsObj.currentPageDatas
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getSummarys(index)
        })
      })
    },
  },
  computed: {
    
  },
  watch: {
    
  },
  mounted () {
    this.getSummarys()
  }  
}
</script>

<style lang="scss">
.translate-enter-active, .translate-leave-active {
  transition: opacity .5s;
}
.mp-goods-container{
  transition: all .5s;
}
.translate-enter, .translate-leave-to {
  opacity: 0;
  .mp-goods-container{
    transform: translateY(-60%) !important;
  }
}
.mp-goods-mask{
  position: fixed;
  z-index: 10000;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  left: 0;
  top: 0;
  .mp-goods-title{
    position: relative;
    line-height: 80px;
    margin-bottom: 8px;
    text-align: center;
    font-size: 20px;
    color: #303133;
    .el-icon-close{
      position: absolute;
      font-size: 18px;
      right: -8px;
      top: 27px;
      color: #909399;
      cursor: pointer;
      font-weight: bold;
    }
  }
  .mp-goods-container{
    width: 638px;
    height: 678px;
    position: absolute;
    background: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    left: 50%;
    top: 50%;
    margin-left: -319px;
    transform: translateY(-50%);
    padding:0 30px 30px 30px;
    .mp-goods-content{
      font-size: 14px;
      .search-head{
        .label-text{
          display: inline-block;
          margin-right: 4px;
        }
        .mp-input{
          width: 240px;
        }
      }
      .mp-goods-list{
        table{
          width: 100%;
          margin-top: 20px;
          td{
            padding-left: 20px;
            white-space: nowrap;
            overflow: hidden;
            max-width: 154px;
            text-overflow: ellipsis;
          }
          thead{
            line-height: 46px;
            border-bottom: 1px solid #ebeef5;
            font-weight: bold;
            color: #7d8087;
          }
          tbody{
            tr{
              line-height: 46px;
              border-bottom: 1px solid #ebeef5;
            }
            .bg-tr{
              background: #fafafa;
            }
          }
          .no-data{
            text-align: center;
            font-size: 14px;
            color: #4d4f53;
            line-height: 80px;
            text-indent: 62px;
          }
        }
      }
      .page-container{
        text-align: center;
        margin-top: 10px;
      }
    }
  }
}
</style>
