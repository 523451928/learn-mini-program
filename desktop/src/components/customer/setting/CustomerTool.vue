<template>
  <div class="customer-wrapper">
    <div class="customer-tool">
      <el-row>
        <span>客服工具</span>
      </el-row>
      <div class="customer-content">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="share-ruleForm">
          <el-form-item >
            <el-radio v-model="ruleForm.isEnable" @click.native.stop="resetFiled" :label="false">未启用</el-radio>
          </el-form-item>
          <el-form-item prop="serviceTelNumber">
            <el-radio v-model="ruleForm.isEnable" :label="true">启用电话客服</el-radio>
            <el-input  v-model="ruleForm.serviceTelNumber" placeholder="" :disabled="!ruleForm.isEnable"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footer-btn">
      <el-button type="primary" @click="saveTelphone">保存</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mobileReg } from 'assets/js/utils.js'
import { mapState } from 'vuex'
export default {
  data() {
    let validateTelphone = (rule, value, callback) => {
      if (!mobileReg.test(value) && this.ruleForm.isEnable) {
        callback(new Error('请正确输入客服电话号码'))
      }
      callback()
    }
    return {
      ruleForm: {
        isEnable: false,
        serviceTelNumber: '',
        storeId: localStorage.getItem('storeId')
      },
      rules: {
        serviceTelNumber: [
          { validator: validateTelphone, trigger: 'blur' }
        ]
      }
      
    }
  },
  methods: {
    resetFiled() {
      this.$refs.ruleForm.clearValidate('serviceTelNumber')
    },
    saveTelphone() {
      if (this.ruleForm.isEnable) {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$http.put('/api/store/servicenumber', this.ruleForm).then((res) => {
              this.$message.success('保存成功')
            }).catch((err) => {
              this.loginAgain(err).then(() => {
                this.saveTelphone()
              })
            })
          }
        })
      } else {
        let ruleForm = {...this.ruleForm}
        if (!mobileReg.test(this.ruleForm.serviceTelNumber)) {
          ruleForm.serviceTelNumber = null
        }
        this.$http.put('/api/store/servicenumber', ruleForm).then((res) => {
          this.$message.success('保存成功')
        }).catch((err) => {
          this.loginAgain(err).then(() => {
            this.saveTelphone()
          })
        })
      }
    }
  },
  computed: {
    ...mapState([
      'mpShopInfo'
    ])
  },
  watch: {
    mpShopInfo(newVal) {
      this.ruleForm.serviceTelNumber = newVal.customerServiceTelNumber
      this.ruleForm.isEnable = newVal.isCustomerServiceTelNumberEnable || false
    }
  },
  mounted() {
    this.ruleForm.serviceTelNumber = this.mpShopInfo.customerServiceTelNumber
    this.ruleForm.isEnable = this.mpShopInfo.isCustomerServiceTelNumberEnable || false
  }
}
</script>

<style lang="scss">
.customer-wrapper{
  .customer-tool{
    background: #fff !important;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
    padding: 20px !important;
    height: 285px;
    box-sizing: border-box;
    .customer-content{
      margin-top: 80px;
      .el-form-item{
        margin-bottom: 18px;
        .el-form-item__error{
          padding-left: 125px;
        }
      }
    }
    .el-input{
      width: 180px;
      display: inline-block;
      margin-left: 12px;
    }
  }
  .footer-btn{
    text-align: center;
    margin: 48px 0;
  }
}
</style>
