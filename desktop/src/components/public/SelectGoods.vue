<template>
  <transition name="translate">
    <div class="mp-goods-mask">
      <div class="mp-goods-container">
        <p class="mp-goods-title">
          选择商品
          <span class="el-icon-close" @click="hide"></span>
        </p>
        <div class="mp-goods-content">
          <div class="search-head">
            <el-select v-model="shelfStateValue" placeholder="上架状态" @change="changeShelfState">
              <el-option
                v-for="item in shelfStateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <mp-select v-model="groupId" :options="groupOptions" @change="changeGroup" :props="optionsProps" filterable></mp-select>
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
                  <td width="50%">
                    <el-checkbox v-model="allChecked" :indeterminate="isIndeterminate"></el-checkbox>商品名称
                  </td>
                  <td width="25%">价格</td>
                  <td width="25%">上架状态</td>
                </tr>
              </thead>
              <tbody v-if="goodsList.length > 0">
                <tr v-for="(item, index) in goodsList" :key="item.productId" :class="{'bg-tr': index % 2 != 0}">
                  <td>
                    <span class="goods-title">
                      <el-checkbox v-model="item.checked" ></el-checkbox>{{item.title}}
                    </span>
                  </td>
                  <td>{{ item.minSkuPrice == item.maxSkuPrice ? item.minSkuPrice: `${item.minSkuPrice} - ${item.maxSkuPrice}` }}</td>
                  <td> {{item.status == 1 ? '上架中': '已下架'}}</td>
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
              @current-change="changeIndex"
              :current-page="goodsObj.currentPageIndex"
              :page-count="goodsObj.totalPageCount">
            </el-pagination>
          </div>
          <div class="select-footer">
            <span class="count">
              已选择{{checkedGoodsList.length}}个
            </span>
            <el-button type="primary" @click="comfirmSelect">确认</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import MpSelect from '@/components/public/MpSelect'
import { trim, formatGroup, identical, removeRepeatById } from '@/assets/js/utils'
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
   
  },
  components: {
    MpSelect
  },
  data() {
    return {
      goodsVisible: false,
      goodsObj: {},
      groupId: '',
      goodsList: [],
      allList: [],
      queryStr: '',
      pageIndex: 1,
      isIndeterminate: false,
      optionsProps: {
        label: 'name',
        value: 'groupId'
      },
      groupOptions: [],
      shelfStateValue: '',
      shelfStateOptions: [
        {
          label: '上架中',
          value: 'Onsell'
        },
        {
          label: '已下架',
          value: 'Offsell'
        }
      ]
    }
  },
  methods: {
    ...mapMutations([
      'setGoodsList'
    ]),
    getGroupObj() {
      return this.$http.get('/api/product/group/summarys', {params: {
        storeId: localStorage.getItem('storeId')
      }}).then((res) => {
        this.groupObj = res.data.data
        this.groupOptions = formatGroup(this.groupObj.currentPageDatas)
        this.groupOptions.unshift({
          name: '未分组',
          groupId: -1
        })
        return Promise.resolve(this.groupObj.currentPageDatas)
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getGroupObj()
        })
      })
    },
    changeGroup(val) {
      if (val == -1) {
        this.getSummarys(true)
      } else {
        this.groupId = val
        this.getSummarys()
      }
    },
    changeIndex(val) {
      this.pageIndex = val 
      this.getSummarys()
    },
    changeShelfState(val) {
      this.getSummarys()
    },
    show() {
      this.goodsVisible = true
      
    },
    hide() {
      this.$emit('hide')
    },
    comfirmSelect() {
      this.setGoodsList(this.checkedGoodsList)
      this.hide()
    },
    getSummarys(flag) {
      let GroupId
      if (flag) {
        GroupId = null
      } else {
        GroupId = this.groupId
      }
      this.$http.get('/api/product/summarys', {
        params: {
          GroupId,
          Title: this.queryStr,
          Status: this.shelfStateValue,
          StoreId: localStorage.getItem('storeId'),
          pageIndex: this.pageIndex,
          pageSize: 8
        }
      }).then((res) => {
        this.goodsObj = res.data.data
        this.goodsList = this.goodsObj.currentPageDatas
        this.allList = this.allList.concat(this.goodsList)
        this.allList = removeRepeatById(this.allList, 'productId')
        if (this.checkedGoodsList) {
          this.checkedGoodsList.forEach((item) => {
            this.goodsList.forEach((itm) => {
              if (item.productId == itm.productId) {
                this.$set(itm, 'checked', true)
              }
            })
          })
        }
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getSummarys(flag)
        })
      })
    },
  },
  computed: {
    ...mapState([
      'enableGoodsList', 'goodsUseType', 'disableGoodsList'
    ]),
    checkedGoodsList() {
      return this.allList.filter((item) => {
        return item.checked
      })
    },
    allChecked: {
      get() {
        this.isIndeterminate = false
        let arr = this.goodsList.filter((item) => {
          return item.checked
        })
        if (arr.length == this.goodsList.length) {
          return true
        }
        if (arr.length > 0 && arr.length < this.goodsList.length) {
          this.isIndeterminate = true
        }
        return false
      },
      set(val) {
        if (val) {
          this.goodsList.forEach((item) => {
            this.$set(item, 'checked', true)
          })
        } else {
          this.goodsList.forEach((item) => {
            item.checked = false
          })
        }
      }
    }
  },
  watch: {
    goodsList: {
       handler(newVal) {
        newVal.forEach((item) => {
          if (item.checked) {
            this.allList.forEach((itm) => {
              if (itm.productId == item.productId) {
                this.$set(itm, 'checked', true)
              }
            })
          } else {
            this.allList.forEach((itm) => {
              if (itm.productId == item.productId) {
                this.$set(itm, 'checked', false)
              }
            })
          }
        })
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    if (this.goodsUseType == 'enable') {
      this.allList = this.enableGoodsList
    } else {
      this.allList = this.disableGoodsList
    }
    this.getGroupObj()
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
.el-popper{
  z-index: 20003 !important;
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
        .mp-input{
          width: 200px;

        }
        .mp-select, .el-select{
          width: 180px;
          margin-right: 4px;
        }
      }
      .select-footer{
        text-align: center;
        border-top: 1px solid #e4e7ed;
        position: relative;
        padding-top: 10px;
        .count{
          position: absolute;
          left: 0;
        }
      }
      .mp-goods-list{
        table{
          width: 100%;
          margin-top: 20px;
          td{
            padding-left: 20px;
            // text-indent: 20px;
            .el-checkbox{
              margin-right: 10px;
            }
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
              .goods-title{
                display: block;
                max-width: 244px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
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
