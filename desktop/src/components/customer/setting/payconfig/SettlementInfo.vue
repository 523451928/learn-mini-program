<template>
  <div class="panel-content">
    <div class="panel-head">结算信息</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="pay-ruleForm">
      <el-form-item label="账户类型" prop="settlementAccountType">
        <el-select v-model="ruleForm.settlementAccountType" placeholder="请选择账户类型">
          <el-option v-for="item in accountTypeOptions" :disabled="item.disabled" :label="item.label" :value="item.value" :key="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开户名称" prop="settlementAccountCreator">
        <el-input type="text" v-model="ruleForm.settlementAccountCreator" auto-complete="off" placeholder="请输入你的开户名称"></el-input>
      </el-form-item>
      <el-form-item label="开户银行" prop="settlementAccountBank">
        <el-select v-model="ruleForm.settlementAccountBank" @change="changeBank" placeholder="请选择银行">
          <el-option v-for="item in bankOptions" :label="item.label" :value="item.value" :key="item.label"></el-option>
        </el-select>
        <el-popover
          placement="top"
          width="200"
          trigger="hover"
          class="mp-popover">
          <div>如果找不到开户银行，请选择其他银行</div>
          <span class="el-icon-question" slot="reference"></span>
        </el-popover>
      </el-form-item>
      <el-form-item label="" v-if="isBankInput" prop="settlementAccountBankInput">
        <el-input type="text" v-model="ruleForm.settlementAccountBankInput" auto-complete="off" placeholder="请输入银行"></el-input>
      </el-form-item>
      <el-form-item label="开户银行城市" prop="settlementAccountBankAddress">
        <el-cascader
          placeholder="请选择省市"
          v-model="ruleForm.settlementAccountBankAddress"
          :options="area"
          filterable>
        </el-cascader>
      </el-form-item>
      <el-form-item label="开户支行" prop="settlementAccountSubBank">
        <el-input type="text" v-model="ruleForm.settlementAccountSubBank" auto-complete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="银行账号" prop="settlementAccount">
        <el-input type="text" v-model="ruleForm.settlementAccount" auto-complete="off" placeholder=""></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
import { area } from 'assets/json/area'
import { bankOptions } from 'assets/json/bank'
import { mapState } from 'vuex'
export default {
  props: {
    configRuleForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapState([
      'businessType'
    ]),
    accountTypeOptions() {
      let options = [
        {
          label: '法人账户',
          value: 0,
          disabled: false
        },
        {
          label: '对公账户',
          value: 1,
          disabled: false
        }
      ]
      if (this.businessType == '个体工商户') {
        return options
      } else {
        this.ruleForm.settlementAccountType = 1
        options[0].disabled = true
        return options
      }
    }
  },
  data() {
    let validateSettlementAccountBankAddress = (rule, value, callback) => {
      if (value.length < 2 ) {
        callback(new Error('请选择省市'))
      }
      callback()
    }
    let validateSettlementAccountBank = (rule, value, callback) => {
      if (value.length < 2 ) {
        callback(new Error('请选择开户银行'))
      }
      callback()
    }
    let validateSettlementAccount = (rule, value, callback) => {
      if (value.length < 9 || value.length > 30 ) {
        callback(new Error('请输入正确的银行账号'))
      }
      callback()
    }
    return {
      area,
      bankOptions,
      isBankInput: false,
      isInvalid: false,
      // accountTypeOptions: [
      //   {
      //     label: '法人账户',
      //     value: 0,
      //     disabled: false
      //   },
      //   {
      //     label: '对公账户',
      //     value: 1,
      //     disabled: false
      //   }
      // ],
      ruleForm: {
        settlementAccountCreator: this.configRuleForm.settlementAccountCreator || '',
        settlementAccountBankAddress: this.configRuleForm.settlementAccountBankAddress ? this.configRuleForm.settlementAccountBankAddress.split('/') : [],
        settlementAccountBank: this.configRuleForm.settlementAccountBank || '',
        settlementAccount: this.configRuleForm.settlementAccount || '',
        settlementAccountType: this.configRuleForm.settlementAccountType == 'LegalPerson' ? 1 : 0,
        settlementAccountSubBank: this.configRuleForm.settlementAccountSubBank || '',
        settlementAccountBankInput: ''
      },
      rules: {
        settlementAccountCreator: [
          { required: true, message: '请输入开户名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        settlementAccountBankAddress: [
          { required: true, message: '请选择开户银行城市', trigger: 'blur' },
          { validator: validateSettlementAccountBankAddress, trigger: 'change' }
        ],
        settlementAccountBank: [
          { required: true, message: '请选择开户银行', trigger: 'change' },
          { validator: validateSettlementAccountBank, trigger: 'change' }
        ],
        settlementAccountBankInput: [
          { required: true, message: '请填写银行', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        settlementAccountSubBank: [
          { required: true, message: '请填写开户支行', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        settlementAccount: [
          { required: true, message: '请填写银行账号', trigger: 'blur' },
          { validator: validateSettlementAccount, trigger: 'blur' }
        ],
        settlementAccountType: [
          { required: true, message: '请选择账户类型', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    configRuleForm(newVal) {
      this.ruleForm.settlementAccountCreator = newVal.settlementAccountCreator
      this.ruleForm.settlementAccountBankAddress = newVal.settlementAccountBankAddress ? newVal.settlementAccountBankAddress.split('/') : []
      this.ruleForm.settlementAccountBank = newVal.settlementAccountBank
      this.ruleForm.settlementAccount = newVal.settlementAccount
      this.ruleForm.settlementAccountType = newVal.settlementAccountType == 'LegalPerson' ? 1 : 0
      this.ruleForm.settlementAccountSubBank = newVal.settlementAccountSubBank
    }
  },
  methods: {
    changeBank(val) {
      if (val == '其他银行') {
        this.isBankInput = true
      } else {
        this.isBankInput = false
      }
    },
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
  mounted() {
    let hasBank = false
    this.bankOptions.forEach((item) => {
      if (item.value == this.ruleForm.settlementAccountBank) {
        hasBank = true
      }
    })
    if (!hasBank && this.ruleForm.settlementAccountBank) {
      this.ruleForm.settlementAccountBank = '其他银行'
      this.isBankInput = true
    }
    this.area.forEach((province) => {
      province.value = province.label
      province.children.forEach((city) => {
        city.value = city.label
        delete city.children
      })
    })
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
    margin: 48px auto 0 auto;
  }
}
</style>
