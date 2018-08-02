<template>
  <div>
    <div class="login-container" v-if="false">
      <div class="login-header">
        <div class="header-container">
          <span class="logo">
            <img src="../../../assets/imgs/login-logo.png" alt="">
          </span>
          <div class="login-text">登录</div>
        </div>
      </div>
      <el-row class="login-main">
        <el-col :span="24">
          <el-form label-position="top" :model="ruleForm" status-icon :rules="rules2" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="" prop="account">
              <el-input type="text" v-model="ruleForm.account" auto-complete="true" placeholder="用户名">
                <span slot="prefix" class="icon-mpmall">&#xe627;</span>
              </el-input>
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input type="password" v-model="ruleForm.password" @keyup.native.enter="submitForm('ruleForm')" auto-complete="true" placeholder="密码">
                <span slot="prefix" class="icon-mpmall">&#xe628;</span>
              </el-input>
            </el-form-item>
            <div class="clearfix">
              <span @click="forgetPass" class="fr forget-password">忘记密码</span>
            </div>
            <el-form-item>
              <el-button type="primary" class="full-btn" @click="submitForm('ruleForm')">登录</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="login-container" v-else>
      <div class="login-header">
        <div class="header-container">
          <span class="logo">
            <img src="../../../assets/imgs/login-logo.png" alt="">
          </span>
          <div class="login-text">重置密码</div>
        </div>
      </div>
      <el-row class="login-main" v-if="!isEmail">
        <el-col :span="24">
          <el-form label-position="top" :model="ruleForm" status-icon :rules="rules2" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="" prop="account" class="reset-form">
              <el-input type="text" v-model="ruleForm.account" auto-complete="off" @keyup.native.enter="resetPass('ruleForm')" placeholder="用户名" onkeydown="if(event.keyCode==13){return false;}">
                <span slot="prefix" class="icon-mpmall">&#xe627;</span>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="full-btn" @click="resetPass('ruleForm')">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row class="login-main" v-else>
        <el-col :span="24">
          <el-form :model="ruleForm" class="demo-ruleForm">
            <el-form-item label="" prop="account">
              <p class="email-tips">邮件已发送至您{{ruleForm.account}}的邮箱，请在邮件中点击链接重置密码。</p>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="full-btn" @click="openEamil">打开邮箱</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { getURLParameters, debounce, mobileReg, emailReg } from 'assets/js/utils.js'
import { eMap } from "assets/js/emailMap"
import { mapState, mapMutations } from "vuex"
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value.length < 8 || value.length > 16) {
        callback(new Error('请输入正确的密码'))
      } else if(this.invalidPass) {
        callback(new Error('请输入正确的密码'))
      }
      callback()
    }
    let validateAccount = (rule, value, callback) => {
      if (!mobileReg.test(value) && !emailReg.test(value)) {
        callback(new Error('请输入正确的用户名'))
      } else if(this.invalidAccount) {
        callback(new Error('用户名不存在'))
      }
      callback()
    }
    return {
      loading: true,
      isEmail: false,
      invalidAccount: false,
      invalidPass: false,
      ruleForm: {
        account: '',
        password: ''
      },
      rules2: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        account: [
          { validator: validateAccount, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations([
      'setLogin'
    ]),
    openEamil() {
      let isOpenUrl = true
      eMap.forEach((item, key) => {
        if (this.ruleForm.account.indexOf(key) != -1) {
          window.open(item)
          isOpenUrl = false
        }
      })
      if (isOpenUrl) {
        this.$message.warning('邮箱地址暂不支持，请手动打开邮箱')
      }
    },
    forgetPass() {
      this.setLogin(false)
      this.$refs['ruleForm'].resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('/api/Authorize/jwt/merchant', this.ruleForm).then((res) => {
            // this.$message.success('登录成功！')
            setTimeout(() => {
              window.location.href = '../mpshop/shop.html'
              // window.location.href = this.$router.currentRoute.query.nextpage
            }, 0)
            localStorage.setItem('credentials', res.data.data.token)
          }).catch((err) => {
            if (err.response.status == 400 && err.response.data.error.code == '10002' || err.response.status == 400 && err.response.data.error.code == '10008') {
              this.invalidAccount = true
              this.$refs.ruleForm.validateField('account')
              this.invalidAccount = false
            }
            if (err.response.status == 400 && err.response.data.error.code == '10003') {
              this.invalidPass = true
              this.$refs.ruleForm.validateField('password')
              this.invalidPass = false
            }
            console.log(err.response)
          })
        }
      })
    },
    resetPass(formName) {
      this.$http.get('/api/User/credentials/status', {
        params: {
          account: this.ruleForm.account
        }
      }).then((res) => {
        if (res.data.data.statusId == 1 && mobileReg.test(this.ruleForm.account)) {
          this.$router.push({
            path: '/resetpwd',
            query: {
              mobile: this.ruleForm.account
            }
          })
        } else if(res.data.data.statusId == 1 && emailReg.test(this.ruleForm.account)) {
          this.$http.post('/api/verifycode/email',{
            email: this.ruleForm.account,
            pageUrl: `http://sc.mysodao.com/mpmall/dist/user/user.html#/resetpwd?account=${this.ruleForm.account}`
          }).then((res) => {
            console.log(res)
            if (!res.data.error) {
              this.isEmail = true
            }
          })
          // this.$message.success('邮箱验证')
        } else {
          this.invalidAccount = true
          this.$refs.ruleForm.validateField('account')
          this.invalidAccount = false
          // this.$message.error('账号不存在')
        }
      })

      this.$refs[formName].validate((valid) => {
        if (valid) {
        
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },
  computed: {
    ...mapState([
      'isLogin'
    ]),
    account() {
      return this.ruleForm.account
    }
  },
  mounted() {
    this.$watch('account', debounce((newCount) => {
      // console.log(newCount)
    }, 500))
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
  
  .el-form-item{
    // margin: 0;
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
    .reset-form{
      margin-bottom: 6px;
      margin-top: 2px;
    }
    .login-main{
      padding: 50px 42px 0 42px;
      .forget-password{
        font-size: 14px;
        color: #409eff;
        cursor: pointer;
        margin-top: 4px;
      }
      .email-tips{
        line-height: 20px;
        text-align: center;
        color: #606266;
      }
      .icon-mpmall{
        margin-left: 3px;
        font-size: 16px;
        color: #909399;
      }
      .full-btn{
        width: 100%;
        margin-top: 20px;
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
          margin-top: 44px;
          font-weight: bold;
        }
      }
    }
  }
</style>