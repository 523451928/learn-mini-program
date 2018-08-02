<template>
  <div>
    <div v-if="isSubmit">
      <div class="panel-content panel-header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微信配置</el-breadcrumb-item>
          <el-breadcrumb-item @click.native="setSubmitStatus(false)" :to="{ path: '/payconfig' }">支付配置</el-breadcrumb-item>
          <el-breadcrumb-item>填写支付配置</el-breadcrumb-item>
        </el-breadcrumb>
        <p>填写支付配置</p>
      </div>
      <contact-info ref="contactInfo" :configRuleForm = "configRuleForm"></contact-info>
      <management-info ref="managementInfo" :configRuleForm = "configRuleForm"></management-info>
      <merchant-info ref="merchantInfo" :configRuleForm = "configRuleForm"></merchant-info>
      <settlement-info ref="settlementInfo" :configRuleForm = "configRuleForm"></settlement-info>
      <div class="submit-wrap">
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </div>
    <div class="result-wrapper" v-else>
      <div class="result-content fail-content" v-if="configRuleForm.auditStatus == 'NotAllowed'">
        <p>
          <span class="el-icon-error"></span>
        </p>
        <p class="status-text">审核不通过</p>
        <p class="submission-time">审核时间  {{configRuleForm.auditTime | formatDate}}</p>
        <div class="reason-content">
          <p class="reason-title">您不通过的原因如下：</p>
          <p>{{configRuleForm.auditRemark}}</p>
        </div>
        <el-button type="primary" @click="setSubmitStatus(true)">重新配置</el-button>
      </div>
      <div class="result-content submission-content" v-if="configRuleForm.auditStatus == 'Wait'">
        <p>
          <span class="mp-icon-loading icon-mpmall">&#xe6a8;</span>
        </p>
        <p class="status-text">提交审核中</p>
        <p class="submission-time">提交时间  {{configRuleForm.createTime | formatDate}}</p>
        <div class="reason-content">
          <p>平台服务商将在1个工作日内进行材料初审，初审通过后将提交微信进行审核。微信一般在5个工作日内完成审核，并通知结果。由于都是人工进件审核，商户在平台方看到的结果较微信的通知会有1个工作日左右的延迟。请耐心等待~</p>
        </div>
        <el-button type="primary" @click="seeConfig('查看配置')">查看配置</el-button>
      </div>
      <div class="result-content success-content" v-if="configRuleForm.auditStatus == 'Allowed' || !mpUserInfo.appId || (mpUserInfo.appId && hasConfigPayment)">
        <p class="result-title">支付配置</p>
        <p>
          <span>小程序名称</span>{{mpUserInfo.nickName || '未授权'}}
          <span v-if="!mpUserInfo.appId">
            <router-link to="/mpauthorize">去授权</router-link>
            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              class="mp-popover">
              <div>请先前往 设置—小程序授权 授权你的小程序，授权成功后才可以配置支付功能。</div>
              <span class="el-icon-question" slot="reference"></span>
            </el-popover>
          </span>
        </p>
        <p>
          <span>支付方式</span>微信支付
        </p>
        <p>
          <span>
           <el-popover
            placement="top"
            width="200"
            trigger="hover"
            class="mp-popover">
            <div>商户只需提供资质信息，由平台代为微信支付，简化申请流程，提高申请效率</div>
            <span class="el-icon-question" slot="reference"></span>
          </el-popover>模式
          </span>直连服务商模式
        </p>
        <p>
          <span>开通状态</span>{{statusText}} 
          <span v-if="configRuleForm.appId" class="mp-text-btn" @click="seeConfig('查看配置')">查看配置</span> 
          <span v-if="hasConfigPayment" class="mp-text-btn" @click="toConfig">去配置</span>
        </p>
        <p>
          <span>是否开启支付配置</span>
          <el-switch
            @change="changeOpen"
            :disabled="openDisabled"
            v-model="isOpen">
          </el-switch>
        </p>
      </div>
    </div>
    <preview-info @refreshData="getMpInfo" :title="preivewTitle" :hasBtn="hasBtn" ref="previewInfo" :configRuleForm="configRuleForm"></preview-info>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapMutations } from 'vuex'
import { formatDate } from 'src/filters/filters'
import ContactInfo from './payconfig/ContactInfo'
import ManagementInfo from './payconfig/ManagementInfo'
import MerchantInfo from './payconfig/MerchantInfo'
import SettlementInfo from './payconfig/SettlementInfo'
import PreviewInfo from './payconfig/PreviewInfo'
export default {
  components: {
    ContactInfo,
    ManagementInfo,
    MerchantInfo,
    SettlementInfo,
    PreviewInfo
  },
  data() {
    return {
      // configRuleForm: {"contacter":"联系人民","phoneNumber":"13958042203","emailAddress":"522345@qq.com","merchantAbbreviation":"商户简称","managementType":"个体工商户/线下零售/数码电器|电脑办公","specialCrendentialsUri":"http://wxim.juketool.com/uploadedfiles/e8a26218-8396-4d83-8ad1-a705cb9439fe.jpg","supplementaryPicUris":"[\"http://wxim.juketool.com/uploadedfiles/e075dbdc-9071-4acf-99cf-792d24b84bfa.jpg\",\"http://wxim.juketool.com/uploadedfiles/73d74622-1ae7-4677-aef9-bf7a2164c0e4.jpg\",\"http://wxim.juketool.com/uploadedfiles/9e5e13fb-0836-427e-a925-416260a00670.jpg\",\"http://wxim.juketool.com/uploadedfiles/925bd948-b800-4a32-866a-499824dec48f.jpg\"]","settlementAccountCreator":"开户名","settlementAccountBankAddress":"山西/大同","settlementAccountBank":"招行借记卡","settlementAccount":"134567489789","settlementAccountType":0,"bussinessLicensePictureUri":"http://wxim.juketool.com/uploadedfiles/98e1ce0d-5165-4288-8714-07394b75cbb0.jpg","cardFrontalPictureUri":"http://wxim.juketool.com/uploadedfiles/120b1baf-2c68-482c-b4fc-550c6d6669a3.jpg","cardReversePictureUri":"http://wxim.juketool.com/uploadedfiles/8680a70f-4064-4b64-ac91-529ea20b9217.jpg","cardType":0}
      configRuleForm: {},
      hasBtn: true,
      openDisabled: true,
      hasConfigPayment: false,
      isOpen: false,
      preivewTitle: '提交商户资料',
      storeId: localStorage.getItem('storeId')
    }
  },
  methods: {
    ...mapMutations([
      'setMpUserInfo', 'setSubmitStatus'
    ]),
    changeOpen(val) {
      if (val) {
        this.$http.put(`/api/wechat/payment/reference/${this.configRuleForm.id}`).then((res) => {

        })
      }
    },
    seeConfig(title) {
      this.preivewTitle = title
      this.hasBtn = false
      this.$refs.previewInfo.show()
    },
    toConfig() {
      this.setSubmitStatus(true)
    },
    submitForm() {
      let validManagement = this.$refs.managementInfo.validateForm()
      let validContact = this.$refs.contactInfo.validateForm()
      let validSettlement = this.$refs.settlementInfo.validateForm()
      let validMerchant = this.$refs.merchantInfo.validateForm()
      if (this.$refs.managementInfo.isInvalid && this.$refs.contactInfo.isInvalid && this.$refs.settlementInfo.isInvalid && this.$refs.merchantInfo.isInvalid) {
        this.$refs.previewInfo.show()
        let formData = Object.assign(this.$refs.contactInfo.ruleForm, this.$refs.managementInfo.ruleForm, this.$refs.settlementInfo.ruleForm, this.$refs.merchantInfo.ruleForm)
        formData.managementType = formData.managementType.join('/')
        formData.appId = this.mpUserInfo.appId
        formData.settlementAccountBank == '其他银行' ? formData.settlementAccountBank = formData.settlementAccountBankInput : ''
        formData.settlementAccountBankAddress = Array.isArray(formData.settlementAccountBankAddress) ? formData.settlementAccountBankAddress.join('/') : formData.settlementAccountBankAddress
        this.configRuleForm = formData
      }
      this.hasBtn = true
    },
    getMpInfo() {
      this.$http.get('/api/wechat/miniapp', {
        params: {
          storeId: localStorage.getItem('storeId')
        }
      }).then((res) => {
        this.setMpUserInfo(res.data.data)
         if (res.data.data.mchId) {
          this.isOpen = true
          this.openDisabled =true
        }
        this.getPayment(this.storeId)
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getMpInfo()
        })
      })
    },
    getPayment(storeId) {
      this.$http.get('/api/wechat/payment/config', {
        params: {
          storeId
        }
      }).then((res) => {
        this.configRuleForm = res.data.data
        if (this.configRuleForm.auditStatus == 'Allowed' && this.mpUserInfo.mchId === null) {
          this.openDisabled = false
        }
        console.log(this.configRuleForm)
        this.setSubmitStatus(false)
      }).catch((err) => {
        if (err.response.status != 401) {
          this.hasConfigPayment = true
        } else {
          this.loginAgain(err).then(() => {
            this.getPayment(storeId)
          })
        }
      })
    }
  },
  computed: {
    ...mapState([
      'mpUserInfo',
      'isSubmit'
    ]),
    statusText() {
      if (!this.mpUserInfo.appId || !this.configRuleForm.appId) {
        return '未配置'
      } else {
        return '审核通过'
      }
    }
  },
  filters: {
    formatDate
  },
  mounted () {
    this.getMpInfo()
    // let appId = this.mpUserInfo.appId
    // if (!appId) {
    //   this.getMpInfo()
    // } else {
    //   this.setSubmitStatus(false)
    //   this.getPayment(this.storeId)

    // }
  }
}
</script>

<style lang="scss">
.panel-header{
  padding: 22px;
  p{
    margin-top: 15px;
    font-size: 20px;
  }
}
.submit-wrap{
  text-align: center;
  margin: 38px 0 25px 0;
}
.upload-demo{
  width: 200px;
}
.el-select-dropdown{
  width: 374px !important;
  min-width: 300px !important;
}
.result-wrapper{
  min-height: 384px;
  // min-height: 422px;
  text-align: center;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  .el-button{
    margin-bottom: 150px;
  }
  .result-content{
    text-align: center;
    padding: 30px 24px 60px;
    .el-icon-error{
      font-size: 74px;
      color: #f56c6c;
      margin: 130px 0 30px 0;
    }
    .mp-icon-loading{
      font-size: 74px;
      color: #67c23a;
      margin: 130px 0 30px 0;
    }
    .status-text{
      font-size: 24px;
      color: #303133;
      margin-bottom: 24px;
    }
    .submission-time{
      font-size: 14px;
      color: #606266;
    }
    .reason-content{
      width: 70%;
      margin: 35px auto 40px auto;
      padding: 24px;
      text-align: left;
      background: #fafafa;
      color: #606266;
      font-size: 14px;
      p{
        margin-bottom: 16px;
        line-height: 18px;
        &:last-child{
          margin-bottom: 2px;
        }
      }
      .reason-title{
        color: #303133;
      }
    }
  }
  .success-content{
    text-align: left;
    .result-title{
      margin-bottom: 55px;
      font-size: 20px;
      color: #303133;
    }
    p{
      color: #303133;
      font-size: 14px;
      margin-bottom: 28px;
      span{
        display: inline-block;
        width: 140px;
        text-align: right;
        color: #909399;
        margin-right: 24px;
        a{
          color: #159ae9;
        }
      }
      .mp-text-btn{
        color: #159ae9;
        cursor: pointer;
      }
      .mp-popover{
        width: auto;
        display: inline;
        margin: 0;
        .el-icon-question{
          color: #ccc;
          width: auto;
          display: inline;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>

