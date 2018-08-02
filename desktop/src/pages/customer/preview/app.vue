<template>
  <div class="mp-container" :class="{'category-page': isCategoryPage}">
    <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <div class="foot-nav" v-show="hasNavBar">
      <ul>
        <li v-for="(item, index) in pageCatalog" :key="index">
          <router-link :to="item.path">
            <img v-if="item.icon" :src="item.icon">
            <img v-if="item.activeIcon" class="active-img" :src="item.activeIcon">
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapMutations } from 'vuex'
import { getURLParameters } from '@/assets/js/utils'
import axios from 'axios'
export default {
  components: {
  },
  data() {
    return {
      shopInfo: {},
      transitionName: '',
      customComponetList: [],
      templateType: 1,
      isCategoryPage: false,
      pageCatalog: [
        {
          title: '首页',
          icon: require('assets/imgs/home.png'),
          activeIcon: require('assets/imgs/home-active.png'),
          path: '/index'
        },
        {
          title: '分类',
          icon: require('assets/imgs/category-.png'),
          activeIcon: require('assets/imgs/category-active.png'),
          path: '/category'
        },
        {
          title: '购物车',
          icon: require('assets/imgs/carts.png'),
          activeIcon: require('assets/imgs/cart-active.png'),
          path: 'cart'
        },
        {
          title: '我的',
          icon: require('assets/imgs/my.png'),
          activeIcon: require('assets/imgs/my-active.png'),
          path: '/me'
        }
      ]
    }
  },
  methods: {
    ...mapMutations([
      'setConfiguration', 'setNavBar'
    ]),
    getConfig() {
      this.$http.get(`/api/store/facade/preview/${this.storeId}`).then((res) => {
        let Data = res.data.data
        let data = {}
        data =JSON.parse(Data.configuration)
        this.setConfiguration(data)
        this.isCreated = true
      })
    },
    getStoreInfo() {
      this.$http.get(`/api/store/details/${this.storeId}`).then((res) => {
        // this.account = res.data.data.account
        this.shopInfo = res.data.data
      }).catch((err) => {
        if (err.response.status == '401') {
          // window.location.href = `../user/user.html`
        }
      })
    }
  },
  computed: {
    ...mapState([
      'hasNavBar'
    ])
  },
  watch: {
    '$route'(newRouter) {
      let routerName = newRouter.name
      if (routerName == 'index' || routerName == 'category' || routerName == 'cart' || routerName == 'me') {
        this.setNavBar(true)
        this.transitionName = ''
      } else {
        this.transitionName = 'slide'
      }
      if (routerName == 'category' || routerName=='cart') {
        this.isCategoryPage = true
      } else {
        this.isCategoryPage = false
      }
      if (routerName == 'goodslist') {
        document.body.style.background = '#f0f0f0'
      } else if (routerName == 'me') {
        document.body.style.background = '#f7f7f7'
      } else {
        document.body.style.background = '#fff'
      }
    }
  },
  mounted() {
    let queryObj = getURLParameters()
    this.$nextTick(() => {
      console.log(getURLParameters().storeName)
    })
    this.templateType = queryObj.type || 1
    this.storeId = queryObj.storeId || 4
    localStorage.setItem('storeId', this.storeId)
    localStorage.setItem('storeName', decodeURI(queryObj.storeName))
    this.getConfig()
    if (parseInt(this.templateType) === 0) {
      this.pageCatalog = [
       {
          title: '首页',
          icon: require('assets/imgs/home.png'),
          activeIcon: require('assets/imgs/home-active.png'),
          path: '/index'
        },
        {
          title: '购物车',
          icon: require('assets/imgs/carts.png'),
          activeIcon: require('assets/imgs/cart-active.png'),
          path: 'cart'
        },
        {
          title: '我的',
          icon: require('assets/imgs/my.png'),
          activeIcon: require('assets/imgs/my-active.png'),
          path: '/me'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
  *{-webkit-tap-highlight-color:rgba(255,255,255,0);}
  html{
    max-width: 750px;
    margin: 0 auto;
  }

  .slide-enter-active {
    transition: all .3s;
  }
  .slide-leave-active {
    transition: all .3s;
  }
  .slide-enter, .slide-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }
  .mp-container{
    height: 100%;
  }
  .category-page{
    height: 100% !important;
  }
 .foot-nav{
    position: fixed;
    z-index: 1000;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 48px;
    text-align: center;
    background: #f9f9f9;
    width: 100%;
    max-width: 750px;
    box-shadow:0 -1px 0 hsla(0,6%,58%,.6);
  ul{
    display: flex;
    li{
      flex: 1;
      font-size: 12px;
      cursor: pointer;
      .router-link-active{
        img{
          display: none;
        }
        .active-img{
          display: inline-block;
        }
      }
      .active-img{
        display: none;
      }
      img{
        width: 58px;
        margin-top: 2px;
      }
    }
  }
}
</style>