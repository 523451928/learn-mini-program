<template>
  <div class="setting-goods setting-wrapper">
    <div class="setting-head">
      设置商品列表页面
      <span @click="deleteComponent" class="fr delete-btn">
        <span class="el-icon-delete"></span>
        删除
      </span>
    </div>
    <div class="goods-content">
      <div class="goods-item">
        <span class="label-text style-label">样式设置</span>
        <ul class="style-list">
          <li v-for="(item, index) in styleList" :key="index" @click="changeStyle(item)">
            <div :class="{'checked': item.checked}">
              <img :src="item.bgImg" alt="">
              <span class="el-icon-success"></span>
            </div>
          </li>
        </ul>
      </div>
      <div class="goods-item">
        <span class="label-text">标题</span>
        <el-radio-group v-model="goodsObj.titleVisible">
          <el-radio :label="true">显示</el-radio>
          <el-radio :label="false">不显示</el-radio>
        </el-radio-group>
        <div class="input-title" v-show="goodsObj.titleVisible">
          <el-input v-model="goodsObj.title" placeholder="标题名称" maxlength="8"></el-input>
        </div>
      </div>
      <div class="goods-item">
        <span class="label-text">商品分组</span>
        <mp-select v-model="goodsObj.groupId" :options="groupOptions"  @change="getGoodslist" :props="optionsProps" filterable></mp-select>
      </div>
      <div class="goods-item">
        <span class="label-text">商品数量</span>
        <el-radio-group v-model="goodsObj.goodsDispaly" @change="changeCountType">
          <el-radio label="all">展示全部</el-radio>
          <el-radio label="custom">自定义</el-radio>
        </el-radio-group>
        <div class="input-title" v-show="goodsObj.goodsDispaly == 'custom'">
          <el-input-number :min="0" :max="goodsList.length" :controls="false" v-model="goodsCount" @change="changeCount" placeholder="商品数量"></el-input-number>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MpSelect from '@/components/public/MpSelect'
import { formatGroup } from 'assets/js/utils'
export default {
  props: {
    goodsObj: {
      type: Object,
      default() {
        return {
          titleVisible: true,
          title: '标题名称',
          goodsDispaly: 'all',
          goodsCount: '',
          goodsStyle: 'styleA',
          groupId: '',
          goodsList: [
            {

            }
          ]
        }
      }
    }
  },
  components: {
    MpSelect
  },
  data() {
    return {
      editIndex: -1,
      titleVisible: true,
      title: '',
      goodsCount: '',
      goodsDispaly: 'all',
      optionsProps: {
        label: 'name',
        value: 'groupId'
      },
      groupObj: {},
      groupId: '',
      groupOptions: [],
      goodsList: [],
      pageSize: 100,
      styleList: [
        {
          name: 'styleA',
          checked: false,
          bgImg: require('assets/imgs/style-a.png')
        },
        {
          name: 'styleC',
          checked: false,
          bgImg: require('assets/imgs/style-c.png')
        },
        {
          name: 'styleB',
          checked: false,
          bgImg: require('assets/imgs/style-b.png')
        }
      ]
    }
  },
  watch: {
    goodsObj: {
      handler(newVal) {
        this.submit()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    changeStyle(item) {
      this.styleList.forEach((itm) => {
        itm.checked = false
      })
      item.checked = true
      this.goodsObj.goodsStyle = item.name
    },
    changeCountType(val) {
      if (val == 'all') {
        this.goodsObj.goodsList = this.goodsList
        let groupId = this.goodsObj.groupId
        if (groupId) {
          this.getGoodslist(groupId)
        }
      } else {
        this.goodsObj.goodsCount = this.goodsList.length
        this.goodsCount = this.goodsObj.goodsCount
      }
    },
    changeCount(val) {
      if (val > 0 && this.goodsList.length >= val) {
        this.goodsObj.goodsList = this.goodsList.slice(0, val)
        this.goodsObj.goodsCount = val
      } else {
        this.$message.warning(`该组只有${this.goodsList.length}条商品`)
      }
    },
    getGroupObj() {
      return this.$http.get('/api/product/group/summarys', {params: {
        storeId: localStorage.getItem('storeId')
      }}).then((res) => {
        this.groupObj = res.data.data
        this.groupOptions = formatGroup(this.groupObj.currentPageDatas)
        return Promise.resolve(this.groupObj.currentPageDatas)
      })
    },
    getGoodslist(val) {
      this.$http.get('/api/product/summarys', {
        params: {
          groupId: val,
          pageSize: this.pageSize,
          order: 'OrderDes',
          storeId: localStorage.getItem('storeId')
        }
      }).then((res) => {
        this.goodsList = res.data.data.currentPageDatas
        this.goodsObj.goodsList = res.data.data.currentPageDatas
      })
    },
    deleteComponent() {
      this.$emit('deleteComponentBySetting')
    },
    submit() {
      this.$emit('changeGoods', this.goodsObj)
    }
  },
  mounted() {
    this.goodsList = this.goodsObj.goodsList
    this.goodsCount = this.goodsList.length
    this.goodsObj.goodsCount = this.goodsList.length
    this.styleList.forEach((item) => {
      if (item.name == this.goodsObj.goodsStyle) {
        item.checked = true
      }
    })
    this.getGroupObj()
  }
}
</script>

<style lang="scss">
@import '~@/assets/css/mixin.scss';
.setting-wrapper{
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  background: #fff;
  padding: 20px 30px;
  .mp-select{
    .select-val{
      top: 11px;
    }
  }
  .goods-content{
    margin-top: 18px;
    height: 550px;
    overflow-y: auto;
    @include scrollBar;
    .goods-item{
      // background: #f5f8fc;
      // padding: 20px;
      margin-bottom: 24px;
      .style-list{
        display: inline-block;
        li{
          display: inline-block;
          cursor: pointer;
          width: 178px;
          height: 120px;
          margin-right: 18px;
          div{
            position: relative;
            height: 100%;
            background: #ebebeb;
            .el-icon-success{
              font-size: 24px;
              position: absolute;
              right: 10px;
              top: 10px;
              color: #848484;
            }
          }
          .checked{
            .el-icon-success{
              color: #1989fa;
            }
          }
        }
      }
      .input-title{
        margin-left: 72px;
        margin-top: 10px;
        width: 316px;
        .el-input-number{
          width: 315px;
        }
        .el-input__inner{
          text-align: left;
        }
      }
      .mp-select{
        // position: absolute;
        width: 314px;
      }
      .mp-input{
        margin: 0 20px;
      }
      .el-button--default{
        margin-left: 20px;
      }
      .mp-link{
        padding: 0 5px;
        margin-top: 18px;
        margin-right: 50px;
      }
      // .mp-select-wrapper{
      //   min-height: 160px;
      //   height: 240px;
      //   position: relative;
      //   color: #606266;
      //   z-index: 100;
      //   width: 106%;
      //   left: -4px;
      //   top: -45px;
      // }
      .mp-select-content{
        max-height: 150px;
        overflow-y: auto;
      }
      .goods-name{
        margin-bottom: 10px;
        .el-input{
          width: 314px;
        }
      }
      .group-img{
        margin-bottom: 25px;
      }
    }
    .label-text{
      display: inline-block;
      text-align: right;
      color: #606266;
      font-size: 14px;
      margin-right: 10px;
      width: 60px;
    }
    .style-label{
      vertical-align: top;
    }
  }
  .setting-head{
    color: #303133;
    font-size: 16px;
  }
  .img-tips{
    font-size: 14px;
    color: #909399;
    margin-left: 5px;
  }
  .delete-btn{
    cursor: pointer;
    font-size: 14px;
    color: #1989fa;
  }
}

</style>
