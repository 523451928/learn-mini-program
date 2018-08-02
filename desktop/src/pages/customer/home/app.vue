<template>
  <div class="mp-container">
    <el-container>
      <el-aside width="138px" class="sup-el-aside">
        <el-row>
          <div class="logo">
            <img style="margin-top:28px;" src="../../../assets/imgs/logo.png" alt="">
          </div>
        </el-row>
        <left-menu class="left-menu" v-show="isLeftMenu" defaultIndex="1" :permissions="getPermissions" ></left-menu>
      </el-aside>
      <el-container class="mp-content">
        <el-header class="home-header" height="50px">
          <el-dropdown trigger="click" class="fr">
            <span class="el-dropdown-link">
              <img :src="shopInfo.storeLogoUri" alt="" style="width: 30px; border-radius: 50%;"> {{shopInfo.storeName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="custom-dropdown">
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
        <div class="router-box">
          <router-view></router-view>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
/* eslint-disable */
require("assets/css/customer/customer.scss")
import LeftMenu from 'components/public/LeftMenu'
import { mapMutations, mapGetters } from 'vuex'
export default {
  components: {
    LeftMenu
  },
  data() {
    return {
      account: '18956425846',
      permissions: [],
      shopList: [],
      shopInfo: {},
      isLeftMenu: false
    }
  },
  created() {
    this.getSummarys()
    this.getStoreInfo()
  },
  computed: {
    ...mapGetters([
      "getPermissions",
      "getMain"
    ]),
  },
  methods: {
    ...mapMutations([
      "setPermissions",
      "setMain"
    ]),
    changeStore(item) {
      localStorage.setItem('storeId', item.storeId)
      this.getStoreInfo()
      window.location.reload()
    },
    logout() {
      localStorage.removeItem('credentials')
      window.location.href = '../user/user.html#/login'
    },
    getMechant() {
      this.$http.get('/api/User/merchant').then((res) => {
        this.setPermissions(res.data.data.actions || [])
        this.setMain(res.data.data.isMain)
        this.account = res.data.data.account
        this.isLeftMenu = true
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getMechant()
        })
      })
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
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getSummarys(pageIndex)
        })
      })
    },
    getStoreInfo() {
      let storeId = localStorage.getItem('storeId')
      this.$http.get(`/api/store/details/${storeId}`).then((res) => {
        this.shopInfo = res.data.data
        this.bus.$emit('storename', this.shopInfo.storeName)
      }).catch((err) => {
        if (err.response.status == '401') {
          this.loginAgain(err).then(() => {
            this.getStoreInfo()
          })
          // window.location.href = `../user/user.html#/login?nextpage=${window.location.href}`
        }
      })
    }
  },
  watch: {
    '$route'(newRouter) {
    }
  },
  mounted() {
    document.querySelector('.el-menu').style.border = 'none'
    this.getMechant()
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  .el-menu {
    border: none;
  }
}
.router-box{
  height: 100%;
  overflow: auto;
}
.home-header {
  margin-bottom: 0;
}
.el-header {
  padding: 0 24px;
}
.el-menu {
  border: none;
}
.last-item {
  text-align: center;
  padding: 4px 0 9px 0;
}
.el-dropdown-link {
  img {
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
</style>