<template>
  <div class="wrapper">
    <el-container class="mp-container">
      <top-header></top-header>
    </el-container>
    <router-view></router-view>
  </div>
</template>

<script>
/* eslint-disable */
require("assets/css/customer/customer.scss")
import TopHeader from '@/components/public/TopHeader'
export default {
  components: {
    TopHeader
  },
}
</script>

<style lang="scss" scoped>
  .el-popper{
    margin-top: 28px !important;
  }
  .wrapper{
    height: 100%;
    .mp-container{
      height: auto;
    }
  }
</style>
