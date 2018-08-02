<template>
  <div class="classify-wrapper-a">
    <div>
      <div class="search-head">
        <div>
           <span class="el-icon-search"></span>
          想要什么?这里会有~
        </div>
      </div>
      <draggable class="default-drag classify-list" element="ul" v-model="classifyList" :options="dragOptions"> 
        <li v-for="(item, index) in classifyList" :key="index" class="classify-item">
          <img :src="item.imgUrl || defaultImg" alt="">
          <!-- <span v-else class="occupy-span"></span> -->
          <p>{{item.classifyName ? item.classifyName : '分类名称'}}</p>
        </li>
      </draggable>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { dragOptions } from '@/assets/js/utils'
export default {
  props: {
   
  },
  data() {
    return {
      dragOptions,
      defaultImg: require('@/assets/imgs/category-default.png')
    }
  },
  methods: {
    ...mapMutations([
      'setClassifyListA'
    ])
  },
  computed: {
    ...mapState([
      'classifyListA'
    ]),
    classifyList: {
      get() {
        return this.classifyListA
      },
      set(newVal) {
        this.setClassifyListA(newVal)
      }
    }
  }
}
</script>

<style lang="scss">
 .classify-wrapper-a{
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
   .classify-list{
     background: #fff;
     padding: 0 5px;
     box-sizing: border-box;
     min-height: 389px;
     .classify-item{
       width: 33%;
       display: inline-block;
       box-sizing: border-box;
       padding: 5px;
       img{
         width: 76px;
         height: 76px;
         border-radius: 4px;
       }
       .occupy-span{
          display: inline-block;
          width: 80px;
          height: 80px;
          background: #ebebeb;
          border-radius: 4px;
       }
       p{
         font-size: 14px;
         text-align: center;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;

       }
     }
   }
 }
</style>
