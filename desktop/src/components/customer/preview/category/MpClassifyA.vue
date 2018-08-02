<template>
  <div class="classify-wrapper-a">
    <div>
      <div class="search-head">
        <div @click="toSearchPage">
           <span class="el-icon-search"></span>
          想要什么?这里会有~
        </div>
      </div>
      <ul class="classify-list">
        <li v-for="(item, index) in classifyListA" :key="index" class="classify-item" @click="toGoodsList(item)">
          <img :src="item.imgUrl || defaultImg" alt="">
          <!-- <span v-else class="occupy-span"></span> -->
          <p>{{item.classifyName ? item.classifyName : '分类名称'}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mixins } from '../mixins'
export default {
  name: 'MpClassifyA',
  mixins: [ mixins ],
  props: {
   
  },
  data() {
    return {
      defaultImg: require('@/assets/imgs/category-default.png')
    }
  },
  methods: {
    toSearchPage() {
      this.$router.push({
        path: '/search'
      })
    }
  },
  computed: {
    ...mapState([
      'configuration'
    ]),
    classifyListA() {
      return this.configuration.classifyListA
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss">
 .classify-wrapper-a{
   padding-top: .8rem;
   padding-bottom: .96rem;
   .search-head{
     position: fixed;
     top: 0;
     padding: 5px 8px;
     height: .8rem;
     width: 100%;
     box-sizing: border-box;
     background: #f0f0f0;
     div{
        background: #fff;
        color: #b2b2b2;
        padding: 8px 8px;
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
     .classify-item{
       width: 33.3%;
       display: inline-block;
       box-sizing: border-box;
       padding: 5px;
       img{
         display: block;
         width: 2.06rem;
         height: 2.06rem;
         border-radius: 4px;
         margin: 0 auto;
       }
       .occupy-span{
          display: block;
          width: 2.06rem;
          height: 2.06rem;
          background: #ebebeb;
          border-radius: 4px;
          margin: 0 auto;
       }
       p{
         font-size: 14px;
         text-align: center;
         line-height: .56rem;
       }
     }
   }
 }
</style>
