<template>
  <div>
    <div class="login-container">
      <div class="login-header">
        <div class="header-container">
          <span class="logo">
            <img src="../../../assets/imgs/login-logo.png" alt="">
          </span>
          <div class="login-text">重置密码</div>
        </div>
      </div>
      <el-row class="login-main">
        <el-col :span="24">
          <el-form label-position="top" :model="ruleForm" status-icon :rules="rules2" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item>
              <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="用户名" :disabled="true">
                <span slot="prefix" class="icon-mpmall">&#xe627;</span>
              </el-input>
            </el-form-item>
            <el-form-item class="clearfix" prop="verifyCode" v-if="isMobile">
              <el-input type="text" class="fl small-input" v-model="ruleForm.verifyCode"  auto-complete="off" placeholder="4位验证码">
                <span slot="prefix" class="icon-mpmall">&#xe62a;</span>
              </el-input>
              <el-button @click="sendVerification" :disabled="sendDisable" class="send-btn" :class="{'disabled': sendDisable}">
                <span v-if='!sendDisable'>发送验证码</span>
                <span v-else>{{count+'秒后重发'}}</span>
              </el-button>
            </el-form-item>
            <el-form-item label="" prop="newPassword">
              <el-input type="password" v-model="ruleForm.newPassword" auto-complete="off" placeholder="设置8位以上的密码">
                <span slot="prefix" class="icon-mpmall">&#xe628;</span>
              </el-input>
            </el-form-item>
            <el-form-item v-if="!isMobile" label="" prop="checkPass">
              <el-input type="password" v-model="ruleForm.checkPass" @keyup.native.enter="submitForm('ruleForm')" auto-complete="off" placeholder="请再次输入密码">
                <span slot="prefix" class="icon-mpmall">&#xe628;</span>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="full-btn" @click="submitForm('ruleForm')">重置密码</el-button>
              <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请设置8至16位的密码'))
      } else {
        if (value.length < 8 || value.length > 16) {
          callback(new Error('请设置8至16位的密码'))
        }
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    let validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value.length != 4) {
        callback(new Error('请输入正确的验证码'))
      } else if (this.invalidCode) {
        callback(new Error('请输入正确的验证码'))
      }
      callback()
    }
    return {
      loading: true,
      invalidCode: false,
      sendDisable: false,
      count: 60,
      isMobile: false,
      ruleForm: {
        account: '',
        newPassword: '',
        verifyCode: '',
        checkPass: ''
      },
      rules2: {
        newPassword: [
          { validator: validatePass, trigger: 'blur' }
        ],
        verifyCode: [
          { validator: validateCode, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    sendVerification(flag) {
      if (this.sendDisable && flag != 1) {
        return
      }
      if (!this.sendDisable && flag != 1) {
        this.$http.post('/api/verifycode/phone',{
          phone: this.ruleForm.account
        }).then((res) => {
          // console.log(res)
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
          this.$http.put('/api/User/credentials/reset', this.ruleForm).then((res) => {
            if (!res.data.error) {
              // this.$message.success('重置成功')
              this.$router.push('/login')
            }
          }).catch((err) => {
            console.log(err.response)
            if (err.response.data.error.code == '10004') {
              if (this.isMobile) {
                this.invalidCode = true
                this.$refs.ruleForm.validateField('verifyCode')
                this.invalidCode = false
              } else {
                this.$router.push('/urlinvalid')
              }
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted() {
    let queryObj = this.$router.currentRoute.query
    if (queryObj.mobile) {
      this.isMobile = true
      this.ruleForm.account = queryObj.mobile
    } else {
      this.isMobile = false
      this.ruleForm.account = queryObj.account
      this.ruleForm.verifyCode = queryObj.code
    }
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
      padding: 54px 42px 0 42px;
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
        margin-top: 10px;
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
      }
    }
  }
</style>