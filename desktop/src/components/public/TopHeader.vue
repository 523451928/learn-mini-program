<template>
  <el-header class="m-top-header" data-flex="dir:left cross:center main:justify">
    <span>
      <img class="logo-img" src="../../assets/imgs/logo.png" alt="">
    </span>
    <el-dropdown trigger="click" class="mp-dropdown">
      <span class="el-dropdown-link">
        {{account}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <a style="color: #606266;" href="../mpshop/shop.html#/modifypwd">
            <span class="icon-mpmall">&#xe628;</span>修改密码
          </a>
        </el-dropdown-item>
        <el-dropdown-item divided @click.native="logout">
          <span class="icon-mpmall">&#xe632;</span>退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-header>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  created() {
    this.getUserInfo()
  },
  data() {
    return {
      account: '' // 登录信息
    }
  },
  methods: {
    ...mapMutations([
      'setMainAccount'
    ]),
    /**
     * 退出登录
     */
    logout() {
      localStorage.removeItem('credentials')
      window.location.href = '../user/user.html'
    },
    /**
     * 获取登录数据
     */
    getUserInfo() {
      this.$http.get('/api/User/merchant').then((res) => {
        this.account = res.data.data.account
        this.setMainAccount(res.data.data.isMain)
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getUserInfo()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/css/variables.scss';
@import '~@/assets/css/mixin.scss';
.m-top-header {
  width: 100%;
  height: 72px !important;
  @include boxShadow;
  padding:0 24px;
  background-color: $c-nc-1;
  .mp-dropdown{
    cursor: pointer;
  }
  .logo-img{
    margin-left: 24px;
  }
}
</style>
