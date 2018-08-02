<template>
  <div class="classify-wrapper-b">
    <div class="search-head">
      <div>
        <span class="el-icon-search"></span>
        想要什么?这里会有~
      </div>
    </div>
    <div class="nav">
      <draggable class="default-drag" element="ul" v-model="classifyList" :options="dragOptions"> 
        <li v-for="(nav, index) in classifyListB" :key="index" :class="{'active-nav': index == activeIndex}" @click="activeIndex = index">
          {{nav.supName}}
        </li>
      </draggable>
    </div>
    <div class="content">
      <draggable class="default-drag classify-list" element="ul" v-model="contentList" :options="dragOptions"> 
        <li v-for="(item, index) in contentList" :key="index" class="classify-item">
          <img :src="item.imgUrl || defaultImg" alt="">
          <!-- <span v-else class="occupy-span"></span> -->
          <p>{{item.name ? item.name : '二级分类'}}</p>
        </li>
      </draggable>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { dragOptions } from 'assets/js/utils'
export default {
  props: {
   
  },
  methods: {
    ...mapMutations([
      'setClassifyListB'
    ])
  },
  data() {
    return {
      dragOptions,
      activeIndex: 0,
      defaultImg: require('@/assets/imgs/category-default.png')
    }
  },
  computed: {
    ...mapState([
      'classifyListB'
    ]),
    classifyList: {
      get() {
        return this.classifyListB
      },
      set(newVal) {
        this.setClassifyListB(newVal)
      }
    },
    contentList: {
      get() {
        if (this.classifyList[this.activeIndex]) {
          return this.classifyList[this.activeIndex].children
        }
      },
      set(newVal) {
        this.classifyList[this.activeIndex].children = newVal
      }
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/css/mixin.scss';
 .classify-wrapper-b{
   height: 386px;
   .search-head{
     padding: 5px 8px;
     height: 34px;
     box-sizing: border-box;
     background: #f0f0f0;
     div{
        background: #fff;
        color: #b2b2b2;
        padding: 4px 8px;
        font-size: 12px;
        border-radius: 3px;
        .el-icon-search{
          margin-right: 6px;
        }
     }
   }
   .nav{
     width: 68px;
     height: 100%;
     float: left;
     overflow-y: auto;
     @include scrollBar;
     li{
       font-size: 12px;
       line-height: 34px;
       height: 34px;
       cursor: pointer;
       text-align: center;
       white-space: nowrap;
       overflow: hidden;
       text-overflow: ellipsis;
       background: #f5f5f5;
       border-bottom: 1px solid #ebebeb;
       user-select: none;
     }
     .active-nav{
       color: #ef6668;
       font-size: 13px;
       background: #fff;
       border-left: 2px solid #ef6668;
     }
   }
   .content{
     margin-left: 68px;
     height: 386px;
     background: #fff;
     overflow-y: auto;
      @include scrollBar;
     .classify-list{
      padding: 2px 7px;
      padding-bottom: 32px;
      .classify-item{
        width: 50%;
        display: inline-block;
        box-sizing: border-box;
        padding: 5px;
        img{
          width: 80px;
          height: 80px;
          border-radius: 4px;
        }
        .occupy-span{
          display: inline-block;
          margin-left: 7px;
          width: 80px;
          height: 80px;
          background: #ebebeb;
          border-radius: 4px;
        }
        p{
          text-align: center;
          font-size: 12px;
          height: 16px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
   }
 }
</style>
