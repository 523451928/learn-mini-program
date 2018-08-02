<template>
  <div class="modify-wrapper">
    <div class="modify-container" v-if="isModify">
      <span class="modify-text">修改密码</span>
      <el-row class="modify-main">
        <el-col :span="24">
          <el-form label-position="left" :model="ruleForm" status-icon :rules="rules2" ref="ruleForm" label-width="60px" class="demo-ruleForm">
            <el-form-item label="原密码" prop="old">
              <el-input type="password" v-model="ruleForm.old" auto-complete="off" placeholder="输入8位以上原密码">
              </el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="new">
              <el-input type="password" v-model="ruleForm.new" auto-complete="off" @keydown.native.enter="submitForm('ruleForm')" placeholder="输入8位以上新密码">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="full-btn" @click="submitForm('ruleForm')">修改</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="success-container" v-else>
      <span class="el-icon-success"></span>
      <p class="success-text">修改成功</p>
      <p class="success-tip">密码修改成功，请重新登陆</p>
      <a href="/user/user.html">
        <el-button type="primary">重新登录</el-button>
      </a>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    let validateOld = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原始密码'))
      } else {
        if (value.length < 8 || value.length > 16) {
          callback(new Error('旧密码在8到16位中'))
        }
        callback()
      }
    }
    let validateNew = (rule, value, callback) => {
       if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (value.length < 8 || value.length > 16) {
          callback(new Error('新密码在8到16位中'))
        }
        callback()
      }
    }
    return {
      loading: true,
      isModify: true,
      ruleForm: {
        old: '',
        new: ''
      },
      rules2: {
        old: [
          { validator: validateOld, trigger: 'blur' }
        ],
        new: [
          { validator: validateNew, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.put('/api/User/credentials', this.ruleForm).then((res) => {
            console.log(res.data)
            this.isModify = false
            if (!res.data.error) {
              this.$message.success('重置成功')
            }
          }).catch((err) => {
            console.log(err.response)
            if (err.response.status == 400) {
              this.$message.error('原密码错误')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.modify-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  .success-container{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -70%);
    width: 360px;
    height: 250px;
    text-align: center;
    .el-icon-success{
      font-size: 68px;
      color: #67c23a;
    }
    .success-text{
      font-size: 18px;
      color: #303133;
      margin: 20px 0 10px 0;
    }
    .success-tip{
      font-size: 14px;
      color: #909399;
      margin-bottom: 45px;
    }
    .el-button--primary{
      padding: 13px 40px;
      a{
        color: #fff;
      }
    }
  }
  .modify-container{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -70%);
    width: 400px;
    height: 250px;
    text-align: center;
    .modify-text{
      font-size: 20px;
      color: #303133;
      display: block;
      margin-bottom: 50px;
    }
    .modify-main{
      .el-form-item{
        margin-bottom: 13px;
      }
      .full-btn{
        width: 100%;
        margin-top: 14px;
      }
    }
    .el-form-item__error{
      text-align: left;
      position: relative;
    }
  }
}
</style>