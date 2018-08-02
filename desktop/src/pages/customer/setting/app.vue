<template>
  <div class="mp-container">
    <el-container>
      <el-aside width="138px" class="sup-el-aside">
        <el-row>
          <div class="logo">
            <img style="margin-top:28px;" src="../../../assets/imgs/logo.png" alt="">
          </div>
        </el-row>
        <left-menu v-show="leftMenuVisible" defaultIndex="5" :permissions="permissions"></left-menu>
      </el-aside>
      <el-container class="mp-content">
        <el-header height="50px">
          <el-dropdown trigger="click" class="fr">
            <span class="el-dropdown-link">
              <img :src="shopInfo.storeLogoUri" alt=""> {{shopInfo.storeName}}<i class="el-icon-arrow-down el-icon--right"></i>
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
                  <router-link v-for="(item, idx) in router.children" :to="item.path" :key="item.text" v-if="!item.disabled">
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
      isLeftMenu: false,
      routeArr: [
        {
          text: '微信配置',
          children: [
            {
              text: '小程序管理',
              path: '/mpauthorize'
            },
            {
              text: '小程序审核',
              path: '/mpexamine'
            },
            {
              text: '支付配置',
              path: '/payconfig'
            }
          ]
        },
         {
          text: '分享设置',
          children: [
            {
              text: '分享内容',
              path: '/sharecontent'
            }
          ]
        },
         {
          text: '运费模板',
          children: [
            {
              text: '模板管理',
              path: '/managetemplate'
            }
          ]
        },
        {
          text: '员工管理',
          children: [
            {
              text: '子账号管理',
              path: '/managesubaccount'
            },
            {
              text: '职位管理',
              path: '/manageposition'
            }
          ]
        },
        {
          text: '客服配置',
          children: [
            {
              text: '客服工具',
              path: '/customertool'
            }
          ]
        }
      ],
      shopList: [],
      permissions: [],
      leftMenuVisible: false
    }
  },
  methods: {
    ...mapMutations([
      'setMpShopInfo', 'setPermissions'
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
    getMerchant() {
      this.$http.get('/api/User/merchant').then((res) => {
        this.permissions = res.data.data.actions || []
        this.setPermissions(this.permissions)
        this.leftMenuVisible = true
        if (!this.permissions.length) return
        if (!res.data.data.isMain) this.routeArr.splice(3, 1)
        let hasAutorize = this.permissions.includes('MiniAppAuthorize')
        let hasAudit = this.permissions.includes('MiniAppAudit')
        let hasPayment = this.permissions.includes('PaymentConfiguration')
        if (!hasAutorize) this.$set(this.routeArr[0].children[0], 'disabled', true) 
        if (!hasAudit) this.$set(this.routeArr[0].children[1], 'disabled', true) 
        if (!hasPayment) this.$set(this.routeArr[0].children[2], 'disabled', true) 
        if (!hasAutorize && !hasAudit && !hasPayment) {
          this.routeArr.splice(0, 1)
        }
        this.excutePermission('ForwardSetting', '分享设置')
        this.excutePermission('FreightTemplate', '运费模板')
        this.excutePermission('CustomerSetting', '客服配置')
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getMerchant()
        })
      })
    },
    getStoreInfo() {
      let storeId = localStorage.getItem('storeId')
      this.$http.get(`/api/store/details/${storeId}`).then((res) => {
        // this.account = res.data.data.account
        this.shopInfo = res.data.data
        this.setMpShopInfo(this.shopInfo)
      }).catch((err) => {
        // if (err.response.status == '401') {
        //   window.location.href = `../user/user.html#/login?nextpage=${window.location.href}`
        // }
        this.loginAgain(err).then(() => {
          this.getStoreInfo()
        })
      })
    },
    excutePermission(permission, text) {
      let hasPermission = this.permissions.includes(permission)
      let index
      if (!hasPermission) {
        this.routeArr.forEach((item, idx) =>{
          if (item.text == text) {
            index = idx
          }
        })
        this.routeArr.splice(index, 1)
      }
    }
  },
  watch: {
    '$route'(newRouter) {
      // console.log(newRouter.path)
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