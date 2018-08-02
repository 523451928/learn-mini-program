<template>
  <div class="classify-wrapper-b">
    <div class="search-head">
      <div @click="toSearchPage">
        <span class="el-icon-search"></span>
        想要什么?这里会有~
      </div>
    </div>
    <div class="nav">
      <ul>
        <li ref="navList" v-for="(nav, index) in classifyListB" :key="index" :class="{'active-nav': index == activeIndex}" @click="activeIndex = index">
          {{nav.supName}}
        </li>
      </ul>
    </div>
    <div class="content">
      <ul class="classify-list">
        <li v-for="(item, index) in contentList" :key="index" class="classify-item" @click="toGoodsList(item)">
          <img :src="item.imgUrl || defaultImg" alt="">
          <!-- <span v-else class="occupy-span"></span> -->
          <p>{{item.name ? item.name : '二级分类'}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Loadmore from '@/assets/js/loadmore'
import { mixins } from '../mixins'
export default {
  mixins: [ mixins ],
  props: {
   
  },
  data() {
    return {
      activeIndex: 0,
      classifyListB: [],
      defaultImg: require('@/assets/imgs/category-default.png')
    }
  },
  methods: {
    ...mapMutations([
      'setNavBar'
    ]),
    toSearchPage() {
      this.$router.push({
        path: '/search'
      })
      this.setNavBar(false)
    }
  },
  computed: {
    ...mapState([
      'configuration'
    ]),
    contentList() {
      if (this.classifyListB && this.classifyListB[this.activeIndex]) {
        return this.classifyListB[this.activeIndex].children
      }
    }
  },
  watch: {
    activeIndex(newVal) {
      let el = this.$refs.navList[newVal]
      this.scrollNav.scrollToElement(el, 300, 0, 0)
    }
  },
  mounted() {
    this.classifyListB = this.configuration.classifyListB
    // this.scrollInstance = new Loadmore({
    //   el: document.querySelector('.content'),
    //   elasticRolling: true,
    //   scrollDirection: 'vertical'
    // })
    let scroll = new BScroll('.content', {
      click: true
    })
    this.scrollNav = new BScroll('.nav', {
      click: true
    })
  }
}
</script>

<style lang="scss">
.category-container{
  margin-bottom: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
 .classify-wrapper-b{
    height: 100%;
    padding-top: .8rem;
    box-sizing: border-box;
    padding-bottom: 48px;
   .search-head{
     position: fixed;
     z-index: 100;
     top: 0;
     left: 0;
     padding: 5px 8px;
     height: .8rem;
     width: 100%;
     box-sizing: border-box;
     background: #f0f0f0;
     div{
        background: #fff;
        color: #b2b2b2;
        padding: 6px 8px;
        font-size: 12px;
        border-radius: 3px;
        .el-icon-search{
          margin-right: 6px;
        }
     }
   }
   .nav{
     width: 2.06rem;
     height: 100%;
     float: left;
     overflow-y: auto;
     position: relative;
     background: #f5f5f5;
     -webkit-overflow-scrolling: touch;
      li{
        font-size: 14px;
        line-height: 1rem;
        height: 1rem;
        cursor: pointer;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background: #f5f5f5;
        border-bottom: 1px solid #ebebeb;
      }
      .active-nav{
        color: #ef6668;
        background: #fff;
        border-left: 2px solid #ef6668;
      }
   }
   .content{
     margin-left: 2.06rem;
     height: 100%;
     background: #fff;
     overflow-y: auto;
     position: relative;
     -webkit-overflow-scrolling: touch;
     .classify-list{
      padding: 2px 7px;
      .classify-item{
        width: 50%;
        display: inline-block;
        box-sizing: border-box;
        padding: 3px 5px 3px 5px;
        img{
          width: 2.06rem;
          height: 2.06rem;
          border-radius: 4px;
          display: block;
          margin: 0 auto;
        }
        .occupy-span{
          display: inline-block;
          margin-left: 7px;
          width: 1.03rem;
          height: 1.03rem;
          background: #ebebeb;
          border-radius: 4px;
          display: block;
          margin: 0 auto;
        }
        p{
          text-align: center;
          font-size: 12px;
          margin-top: 4px;
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
