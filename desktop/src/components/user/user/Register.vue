<template>
  <div class="register-container">
    <div class="register-header">
      <div class="header-container">
        <span class="logo">
          <img src="../../../assets/imgs/login-logo.png" alt="">
        </span>
        <span class="register-tips ">欢迎注册友店账号，请填写手机号验证</span>
      </div>
    </div>
    <el-row class="register-main">
      <el-col :span="24">
        <el-form label-position="top" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item class="clearfix" label="手机号" prop="mobile">
            <el-input type="text" class="fl small-input" v-model="ruleForm.mobile"  auto-complete="off" placeholder="11位手机号码"></el-input>
            <el-button @click="sendVerification" :disabled="sendDisable" class="send-btn" :class="{'disabled': sendDisable}">
              <span v-if='!sendDisable'>发送验证码</span>
              <span v-else>{{count+'秒后重发'}}</span>
            </el-button>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input type="text" v-model="ruleForm.code" auto-complete="off" placeholder="4位验证码"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input  type="password" v-model="ruleForm.pass" @keyup.native.enter="submitForm('ruleForm')" auto-complete="off" placeholder="设置8位以上密码"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- <div class="treaty">注册即代表同意<a href="javascript:void(0);">《xxxxxxxxxxxx》</a></div> -->
            <el-button type="primary" class="full-btn" @click="submitForm('ruleForm')">注册</el-button>
            <div class="login-text">
              <router-link to="/login">立即登录</router-link>
            </div>
            <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import { mobileReg } from 'assets/js/utils.js'
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请设置8至16位的密码'))
      } else {
        if (value.length < 8 || value.length > 16) {
          callback(new Error('请设置8至16位的密码'))
        }
        callback()
      }
    }
    let validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入4位验证码'))
      } else if (value.length != 4) {
        callback(new Error('验证码错误,请检查后重新输入'))
      } else if (this.invalidCode) {
        callback(new Error('验证码错误,请检查后重新输入'))
      }
      callback()
    }
    let validateMobile = (rule, value, callback) => {
      if (!mobileReg.test(value)) {
        callback(new Error('请输入11位手机号'))
      } else if (this.repeatPhone) {
        callback(new Error('手机号已存在'))
      }
      callback()
    }
    return {
      count: 60,
      sendDisable: false,
      loading: true,
      invalidCode: false,
      repeatPhone: false,
      ruleForm: {
        pass: '',
        code: '',
        mobile: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        code: [
          { validator: validateCode, trigger: 'blur' }
        ],
        mobile: [
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    sendVerification(flag) {
      if (!/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(this.ruleForm.mobile) && flag != 1) {
        return
      }
      if (this.sendDisable && flag != 1) {
        return
      }
      if (!this.sendDisable && flag != 1) {
        this.$http.post('/api/verifycode/phone',{
          phone: this.ruleForm.mobile
        }).then((res) => {

        })
      }
      this.count--
      if (this.count > 0) {
        this.sendDisable = true
        setTimeout(() => {
          this.sendVerification(1)
        }, 1000)
      } else {
        this.sendDisable = false
        this.count = 60
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('/api/User/merchant', {
            "phone": this.ruleForm.mobile,
            "password": this.ruleForm.pass,
            "verifyCode": this.ruleForm.code
          },{
            "headers": {'Content-Type': 'application/json'}
          }).then((res) => {
            // this.$message.success('注册成功')
            this.$http.post('/api/Authorize/jwt/merchant', {
              account: this.ruleForm.mobile,
              password: this.ruleForm.pass
            }).then((res) => {
              setTimeout(() => {
                window.location.href = '../user/undertake.html'
              }, 500)
              localStorage.setItem('credentials', res.data.data.token)
            }).catch((err) => {
              console.log(err.response)
            })
          }).catch((err) => {
            if (err.response) {
              let errData = err.response.data.error
              if (errData.code == '10004') {
                this.invalidCode = true
                this.$refs.ruleForm.validateField('code')
                setTimeout(() => {
                  this.invalidCode = false
                }, 100)
                // this.$message.error('验证码错误')
              }
              if (errData.code == '10001') {
                this.repeatPhone = true
                this.$refs.ruleForm.validateField('mobile')
                setTimeout(() => {
                  this.repeatPhone = false
                }, 100)
                // this.$message.error('用户已注册')
              }
              
            }
          })
          // window.location.href = '/customer/home.html'
        } else {
          console.log('error submit!!')
          return false
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted() {
    // this.$router.push({ path: 'register', query: { plan: 'private' }})
    // console.log(this.$router)
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
  .register-container{
    width: 460px;
    // height: 550px;
    padding-bottom: 52px;
    box-sizing: border-box;
    position: fixed;
    background: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    .register-main{
      padding: 26px 42px 0 42px;
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
      .login-text{
        text-align: center;
        a{
          color: #5cacff;
        }
      }
      .treaty{
        // text-align: center;
        color: #606266;
        font-size: 14px;
        a{
          color: #606266;
        }
      }
    }
    .register-header{
      height: 144px;
      border-bottom: 1px solid #ebeef5;
      box-sizing: border-box;
      padding-top: 44px;
      .header-container{
        padding: 0 42px;
        .logo{
          display: block;
          width: 200px;
          margin-bottom: 14px;
          img{
            height: 42px;
            display: block;
          }
        }
        .register-tips{
          color: #909399;
        }
      }
    }
  }
</style>