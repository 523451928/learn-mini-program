<template>
  <div>
    <div class="login-container">
      <div class="login-header">
        <div class="header-container">
          <span class="logo">
            <img src="../../../assets/imgs/login-logo.png" alt="">
          </span>
          <div class="login-text">设置密码</div>
        </div>
      </div>
      <el-row class="login-main">
        <el-col :span="24">
          <el-form label-position="top" :model="ruleForm" status-icon :rules="rules2" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item>
              <el-input type="text" v-model="ruleForm.email" auto-complete="off" placeholder="用户名" :disabled="true">
                <span slot="prefix" class="icon-mpmall">&#xe627;</span>
              </el-input>
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="设置8位以上的密码">
                <span slot="prefix" class="icon-mpmall">&#xe628;</span>
              </el-input>
            </el-form-item>
            <el-form-item label="" prop="checkPass">
              <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="请再次输入密码">
                <span slot="prefix" class="icon-mpmall">&#xe628;</span>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="full-btn" @click="submitForm('ruleForm')">确定</el-button>
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
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 8 || value.length > 16) {
          callback(new Error('密码在8到16位中'))
        }
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: true,
      invalidCode: false,
      ruleForm: {
        email: '',
        password: '',
        code: '',
        checkPass: ''
      },
      rules2: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.get('/api/verifycode/status', {params: {
            target: this.ruleForm.email,
            code: this.ruleForm.code
          }}).then((res) => {
            console.log(res.data.data.statusId)
            let statusId = res.data.data.statusId
            if (statusId) {
              this.$http.post('/api/SubUser', this.ruleForm).then((res) => {
                window.location.href = '../customer/home.html'
              }).catch((err) => {
              })
            } else {
              this.$router.push('/urlinvalid')
            }
          })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted() {
    let queryObj = this.$router.currentRoute.query
    this.ruleForm.email = queryObj.account
    this.ruleForm.code = queryObj.code
    this.$http.get('/api/verifycode/status', {params: {
      target: this.ruleForm.email,
      code: this.ruleForm.code
    }}).then((res) => {
      let statusId = res.data.data.statusId
      if (statusId == 2) {
        // this.$router.push('/urlinvalid')
      }
    })
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
      .forget-password{
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