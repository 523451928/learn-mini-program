<template>
  <transition name="translate">
    <div class="preview-mask" v-if="previewShow">
      <div class="preview-wrapper" @click.stop>
        <div class="preview-title">
          <p>{{title}}</p>
          <span class="el-icon-close" @click="hide"></span>
        </div>
        <div class="preview-content" :class="{'has-btn': hasBtn}">
          <div class="preview-item">
            <p class="item-title">联系信息</p>
            <p class="item-info">
              <span>联系人姓名</span>{{configRuleForm.contacter}}
            </p>
            <p class="item-info">
              <span>手机号码</span>{{configRuleForm.phoneNumber}}
            </p>
            <p class="item-info">
              <span>常用邮箱</span>{{configRuleForm.emailAddress}}
            </p>
          </div>
          <div class="preview-item">
            <p class="item-title">经营信息</p>
            <p class="item-info">
              <span>商家简称</span>{{configRuleForm.merchantAbbreviation}}
            </p>
            <p class="item-info">
              <span>经营类型</span>{{configRuleForm.managementType}}
            </p>
            <p class="item-info">
              <span>特殊资质照片</span>
              <img v-if="configRuleForm.specialCrendentialsUri" :src="configRuleForm.specialCrendentialsUri" alt="">
              <!-- {{configRuleForm.supplementaryPicUris}} -->
            </p>
            <p class="item-info" v-if="configRuleForm.supplementaryPicUris">
              <span>补充材料</span>
              <img v-for="url in configRuleForm.supplementaryPicUris" :src="url" alt="" :key="url">
              <!-- {{configRuleForm.supplementaryPicUris}} -->
            </p>
          </div>
          <div class="preview-item">
            <p class="item-title">商户信息</p>
            <p class="item-info">
              <span>{{labelText}}</span><img v-if="configRuleForm.bussinessLicensePictureUri" :src="configRuleForm.bussinessLicensePictureUri" alt="">
            </p>
            <p class="item-info">
              <span>经办人/法人证件类型</span>{{configRuleForm.cardType == 0 ? '身份证(限中国大陆居民)' : '护照(限境外人士)'}}
            </p>
            <p class="item-info">
              <span>{{configRuleForm.cardType == 0 ? '身份证正面照片' : '护照照片'}}</span><img v-if="configRuleForm.cardFrontalPictureUri" v-lazy="configRuleForm.cardFrontalPictureUri" alt="">
            </p>
            <p class="item-info" v-if="configRuleForm.cardType == 0">
              <span>身份证反面照片</span><img v-if="configRuleForm.cardReversePictureUri" v-lazy="configRuleForm.cardReversePictureUri" alt="">
            </p>
          </div>
          <div class="preview-item">
            <p class="item-title">结算信息</p>
            <p class="item-info">
              <span>账户类型</span>{{configRuleForm.settlementAccountType == 0 ? '法人账户' : '对公账户'}}
            </p>
            <p class="item-info">
              <span>开户名称</span>{{configRuleForm.settlementAccountCreator}}
            </p>
            <p class="item-info">
              <span>开户银行</span>{{configRuleForm.settlementAccountBank}}
            </p>
            <p class="item-info">
              <span>开户银行城市</span>{{configRuleForm.settlementAccountBankAddress}}
            </p>
            <p class="item-info">
              <span>开户支行</span>{{configRuleForm.settlementAccountSubBank}}
            </p>
            <p class="item-info">
              <span>银行账号</span>{{configRuleForm.settlementAccount}}
            </p>
          </div>
        </div>
        <div class="preview-bottom" v-if="hasBtn">
          <el-button @click="hide">取消</el-button>
          <el-button type="primary" @click="submitForm">确认提交</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
/* eslint-disable */
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    configRuleForm: {
      type: Object,
      default() {
        return {
        }
      }
    },
    title: {
      type: String,
      default: '提交商户资料'
    },
    hasBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      previewShow: false
    }
  },
  methods: {
    ...mapMutations([
      'setSubmitStatus'
    ]),
    hide() {
      this.previewShow = false
    },
    show() {
      this.previewShow = true
    },
    submitForm() {
      this.$http.post('/api/wechat/payment/config', this.configRuleForm).then((res) => {
        this.hide()
        this.setSubmitStatus(false)
        this.$emit('refreshData')
        window.location.reload()
        console.log(res)
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.submitForm()
        })
      })
    }
  },
  computed: {
    ...mapState([
      'businessType'
    ]),
    labelText() {
      if (this.businessType == '政府及事业单位' || this.businessType == '其他组织') {
        return '证件照片'
      } else {
        return '营业执照照片'
      }
    }
  }
}
</script>

<style lang="scss">
  @import '~@/assets/css/mixin.scss';
  .preview-mask{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.6);
    .preview-wrapper{
      width: 702px;
      height: 80%;
      background: #fff;
      border-radius: 4px;
      border: 1px solid #e4e7ed;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateY(-50%);
      margin-left: -352px;
      .preview-title{
        height: 8%;
        position: relative;
        text-align: center;
        p{
          padding-top: 30px;
          font-size: 20px;
          color: #303133;
        }
        .el-icon-close{
          position: absolute;
          right: 15px;
          top: 27px;
          font-size: 18px;
          color: #909399;
          font-weight: bold;
          cursor: pointer;
        }
      }
      .preview-content{
        height: 92%;
        overflow-y: scroll;
        &.has-btn{
          height: 80%;
        }
        @include scrollBar;
        .preview-item{
          padding: 27px 0 0 56px;
          border-bottom: 1px solid #ebeef5;
          &:last-child{
            border-bottom: none;
          }
          p{
            margin-bottom: 22px;
            font-size: 14px;
          }
          .item-title{
            color: #333;
            font-weight: bold;
          }
          .item-info{
            color: #303133;
            img{
              width: 90px;
              height: 90px;
              display: inline-block;
              margin-right: 10px;
            }
            span{
              color: #909399;
              display: inline-block;
              width: 100px;
              vertical-align: top;
            }
          }
        }
      }
      .preview-bottom{
        position: absolute;
        bottom: 0;
        left: 0;
        height: 12%;
        line-height: 12%;
        width: 100%;
        border-top: 1px solid #e4e7ed;
        text-align: center;
        justify-content:center;
        align-items:center;
        display:flex;
        .el-button{
          width: 90px;
          height: 30px;
          line-height: 30px;
          padding: 0;
          border-radius: 2px;
          span{
            display: inline-block !important;
            width: 90px;
            height: 30px;
            line-height: 30px;
          }
        }
      }
    }
  }
  .translate-enter-active, .translate-leave-active {
    transition: opacity .5s;
  }
  .translate-enter, .translate-leave-to {
    opacity: 0;
    .preview-wrapper{
      transform: translateY(-55%);
    }
  }
  .preview-wrapper{
    transition: all .5s;
  }
</style>
