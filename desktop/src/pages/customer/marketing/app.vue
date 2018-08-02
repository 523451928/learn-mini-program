<template>
  <div class="mp-container">
    <el-container>
      <el-aside width="138px" class="sup-el-aside">
        <el-row>
          <div class="logo">
            <img style="margin-top:28px;" src="../../../assets/imgs/logo.png" alt="">
          </div>
        </el-row>
        <left-menu defaultIndex="6" v-show="LeftMenuVisible" :permissions="permissions"></left-menu>
      </el-aside>
      <el-container class="mp-content">
        <el-header height="50px">
          <el-dropdown trigger="click" class="fr">
            <span class="el-dropdown-link">
              <img :src="shopInfo.storeLogoUri" alt=""> {{shopInfo.storeName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="custom-dropdown">
              <!-- <el-dropdown-item>
                <a style="color: #606266;" href="/customer/setting.html#/modifypwd">
                  <span class="icon-mpmall">&#xe628;</span>修改密码
                </a>
              </el-dropdown-item> -->
              <el-dropdown-item v-for="item in shopList" :key="item.storeId" @click.native="changeStore(item)">
                <a style="color: #606266;" href="javascript:void(0)">
                  {{item.storeName}}
                </a>
              </el-dropdown-item>
              <el-dropdown-item class="more-shop">
                <a style="color: #606266;" href="../mpshop/shop.html#/selectshop" target="_blank">
                  更多店铺 <span class="el-icon-arrow-right fr"></span>
                </a>
              </el-dropdown-item>
              <el-dropdown-item class="last-item" @click.native="logout">
                <span class="icon-mpmall">&#xe632;</span>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-container>
          <el-aside width="160px" class="sub-el-aside">
            <el-row class="tac">
              <el-menu
                default-active="0"
                class="el-menu-vertical-demo"
                background-color="#ffffff"
                text-color="#727374"
                active-text-color="#303133">
                <el-menu-item-group :title="router.text" v-for="(router, index) in routeArr" :key="router.text">
                  <router-link v-for="(item, idx) in router.children" :to="item.path" :key="item.text">
                    <el-menu-item :index="`${index+1}-${idx+1}`">{{item.text}}</el-menu-item>
                  </router-link>
                </el-menu-item-group>
              </el-menu>
            </el-row>
          </el-aside>
          <el-main class="mp-main" :class="{'mp-other-main': $route.path != '/managesubaccount'}">
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
/* eslint-disable */
require("assets/css/customer/customer.scss")
import LeftMenu from 'components/public/LeftMenu'
import { mapMutations } from 'vuex'
export default {
  components: {
    LeftMenu
  },
  data() {
    return {
      shopInfo: {},
      routeArr: [
        {
          text: '营销工具',
          children: [
            {
              text: '优惠券',
              path: '/coupon',
              disabled: true
            },
            // {
            //   text: '拼团',
            //   path: '/collage'
            // }
          ]
        }
      ],
      shopList: [],
      permissions: [],
      LeftMenuVisible: false
    }
  },
  methods: {
    changeStore(item) {
      localStorage.setItem('storeId', item.storeId)
      this.getStoreInfo()
      window.location.reload()
    },
    logout() {
      localStorage.removeItem('credentials')
      window.location.href = '../user/user.html#/login'
    },
    getSummarys(pageIndex) {
      this.loading = true
      this.$http.get('/api/store/summarys', {
        Name: '',
        UId: '',
        pageIndex,
        pageSize: 10
      }).then((res) => {
        this.shopList = res.data.data.currentPageDatas
        if (this.shopList.length > 4) {
          this.shopList = this.shopList.slice(0, 4)
        }
      })
    },
    getMerchant() {
      this.$http.get('/api/User/merchant').then((res) => {
        this.permissions = res.data.data.actions || []
        this.LeftMenuVisible = true
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getMerchant()
        })
      })
    },
    getStoreInfo() {
      let storeId = localStorage.getItem('storeId')
      this.$http.get(`/api/store/details/${storeId}`).then((res) => {
        this.shopInfo = res.data.data
      }).catch((err) => {
        // if (err.response.status == '401') {
        //   console.log(window.location)
        //   // window.location.href = '../user/user.html'
        //   window.location.href = `../user/user.html#/login?nextpage=${window.location.href}`
        // }
        this.loginAgain(err).then(() => {
          this.getStoreInfo()
        })
      })
    }
  },
  watch: {
    '$route'(newRouter) {
      
    }
  },
  mounted () {
    this.getStoreInfo()
    this.getSummarys(1)
    this.getMerchant()
  }
}
</script>

<style lang="scss">
.mp-other-main{
  padding: 0 18px 0 0 !important;
  background: none !important;
  box-shadow: none !important;
  margin-right: 0 !important;
}
.el-header{
  padding: 0 24px;
}
.el-menu{
  border: none;
}
.last-item{
  text-align: center;
  padding: 4px 0 9px 0;
}
.el-dropdown-link{
  img{
    width: 30px;
    height: 30px;
    position: absolute;
    border-radius: 50%;
    left: -33px;
    top: -8px;
    border: 1px solid #eee;
    // box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.3);
  }
}
.el-dropdown-menu__item{
  a{
    max-width: 120px !important;
  }
}
.more-shop{
  a{
    width: 120px !important;
  }
}
</style>