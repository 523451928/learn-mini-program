<template>
  <div class="panel-content">
    <div class="panel-head">联系信息</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="pay-ruleForm">
      <el-form-item label="联系人姓名" prop="contacter">
        <el-input type="text" v-model="ruleForm.contacter" auto-complete="off" placeholder=""></el-input>
        <el-popover
          placement="top"
          width="200"
          trigger="hover"
          class="mp-popover">
          <div>请填写商户微信支付业务联系人的真实姓名，我们会在微信签约时进行实名认证</div>
          <span class="el-icon-question" slot="reference"></span>
        </el-popover>
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input type="text" v-model="ruleForm.phoneNumber" auto-complete="off" placeholder="">
          <template slot="prepend">+86</template>
        </el-input>
        <el-popover
          placement="top"
          width="200"
          trigger="hover"
          class="mp-popover">
          <div>用于接收微信支付的重要管理信息及日常操作验证码，我们会在微信签约时进行短信验证</div>
          <span class="el-icon-question" slot="reference"></span>
        </el-popover>
      </el-form-item>
      <el-form-item label="常用邮箱" prop="emailAddress">
        <el-input type="text" v-model="ruleForm.emailAddress" auto-complete="off" placeholder=""></el-input>
        <el-popover
          placement="top"
          width="200"
          trigger="hover"
          class="mp-popover">
          <div>非常重要！用于接收微信支付的账号密码</div>
          <span class="el-icon-question" slot="reference"></span>
        </el-popover>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
import { mobileReg, emailReg, cnReg, enReg } from 'assets/js/utils.js'
export default {
  props: {
    configRuleForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    let validateContacter = (rule, value, callback) => {
      if (value.length > 30) {
        callback(new Error('请输入30字以内的姓名'))
      } else if (!enReg.test(value) && !cnReg.test(value)) {
        callback(new Error('请输入正确的姓名'))
      }
      callback()
    }
    let validateMobile = (rule, value, callback) => {
      if (!mobileReg.test(value)) {
        callback(new Error('手机号不正确或号码所在号段暂不支持，请检查后重试'))
      }
      callback()
    }
    let validateEmail = (rule, value, callback) => {
      if (!emailReg.test(value)) {
        callback(new Error('请输入正确的常用邮箱'))
      }
      callback()
    }
    return {
      isInvalid:false,
      ruleForm: {
        appId: this.configRuleForm.appId,
        contacter: this.configRuleForm.contacter || '',
        phoneNumber: this.configRuleForm.phoneNumber || '',
        emailAddress: this.configRuleForm.emailAddress || ''
      },
      rules: {
        contacter: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          { validator: validateContacter,  trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        emailAddress: [
          { required: true, message: '请输入常用邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    configRuleForm(newVal) {
      this.ruleForm.appId = newVal.appId
      this.ruleForm.contacter = newVal.contacter
      this.ruleForm.phoneNumber = newVal.phoneNumber
      this.ruleForm.emailAddress = newVal.emailAddress
    }
  },
  methods: {
    validateForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.isInvalid = true
          return true
        } else {
          return false
        }
      })
    }
  },
  mounted () {
    console.log(this.ruleForm)
  }
}
</script>

<style lang="scss">
.panel-content{
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  background: #fff;
  margin-bottom: 24px;
  padding-bottom: 30px;
  .el-icon-question{
    color: #cccccc;
  }
  .panel-head{
    line-height: 50px;
    text-indent: 25px;
    border-bottom: 1px solid #ebeef5;
  }
  .el-input{
    width: 90%;
    margin-right: 10px;
  }
  .pay-ruleForm{
    width: 520px;
    // margin: 48px auto 0 auto;
    margin-left: 115px !important;
  }
}
</style>
