<template>
  <div>
    <div class="login-container">
      <div class="login-header">
        <div class="header-container">
          <span class="logo">
            <img src="../../../assets/imgs/login-logo.png" alt="">
          </span>
          <div class="login-text">链接失效</div>
          <p class="invalid-request">您的请求已经过期，请重新提交。</p>
        </div>
      </div>
      <el-row class="login-main">
        <el-col :span="24">
          <el-button type="primary" class="full-btn" @click="submitForm('ruleForm')">重新提交</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapMutations } from 'vuex'
export default {
  data() {
    return{

    }
  },
  methods: {
    ...mapMutations([
      'setLogin'
    ]),
    submitForm(formName) {
      this.setLogin(false)
      this.$router.push('/login')
    }
  },
  mounted() {
  }
}
</script>
<style lang="scss" scoped>
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .small-input{
    width: 250px;
    margin-right: 14px;
  }
  .login-container{
    width: 460px;
    // height: 550px;
    padding-bottom: 52px;
    position: fixed;
    background: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    border-radius: 6px;
    .login-main{
      padding: 50px 42px 0 42px;
      .forget-newPassword{
        font-size: 14px;
        color: #409eff;
        cursor: pointer;
      }
      .icon-mpmall{
        margin-left: 3px;
        font-size: 16px;
        color: #909399;
      }
      .full-btn{
        width: 100%;
        margin-top: 34px;
        background: #5cacff;
      }
      .send-btn{
        width: 112px;
        color: #5cacff;
        border-color: #5cacff;
        &:focus{
          background: #fff;
        }
      }
      .disabled{
        cursor: not-allowed;
        color: #909399;
        border-color: #c0c4cc;
      }
      .treaty{
        text-align: center;
        color: #606266;
        font-size: 14px;
        a{
          color: #606266;
        }
      }
    }
    .login-header{
      height: 130px;
      box-sizing: border-box;
      padding-top: 48px;
      .header-container{
        padding: 0 42px;
        text-align: center;
        .logo{
          display: block;
          width: 200px;
          height: 38px;
          margin-bottom: 14px;
          margin: 0 auto;
        }
        .login-text{
          font-size: 20px;
          color: #303133;
          margin-top: 46px;
          font-weight: bold;
        }
        .invalid-request{
          margin-top: 14px;
          color: #606266;
        }
      }
    }
  }
</style>