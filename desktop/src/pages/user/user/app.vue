<template>
  <div class="bg">
    <div class="mask"></div>
    <router-view class="container"></router-view>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  
}
</script>

<style lang="scss">
  body{
    .login-container{
      .el-form-item{
        margin-bottom: 16px;
      }
    }
    .bg{
      .mask{
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0,0,0,0.6);
        width: 100%;
        height: 100%;
      }
      width: 100%;
      height: 100%;
      background: url('./bg.jpg');
      background-size: cover;
    }
    .el-form--label-top{
      .el-form-item__label{
        padding: 0;
        line-height: 30px;
      }
    }
    .el-form-item__error{
      position: relative;
      padding-top: 8px;
    }
    .el-form-item{
      margin-bottom: 6px;
    }
  }
</style>
