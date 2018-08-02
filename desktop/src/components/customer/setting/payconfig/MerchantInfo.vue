<template>
  <div class="panel-content">
    <div class="panel-head">商户信息</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="pay-ruleForm merchant-ruleForm">
      <p class="license-tip" v-show="businessType == '政府及事业单位'">请上传相关部门颁发的证书，如：事业单位法人证书、统一社会信用代码证书（若贵司为政府机关，无法提供上述登记证书，可在此处上传组织机构代码证）</p>
      <p class="license-tip" v-show="businessType == '其他组织'">民办非企业单位、非营利医疗机构请提供《民办非企业单位登记证书》；社会团体请提供《社会团体登记证书》；其他类型请提供相关登记证书、批文或证明等</p>
      <el-form-item :label="labelText" prop="bussinessLicensePictureUri">
        <el-upload
          class="upload-img"
          action="https://wxim.juketool.com/Files/Upload"
          v-model="ruleForm.bussinessLicensePictureUri"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :before-upload="beforeUpload"
          :file-list="bussinessFileList"
          list-type="picture">
          <el-button size="small">上传文件</el-button>
          <div slot="tip" class="el-upload__tip">需年检章齐全（当年成立公司除外）;必须为彩色图片且小于2M，文件格式为bmp、png、jpeg、jpg或gif</div>
        </el-upload>
      </el-form-item>
      <el-form-item :label="cardLabelText" prop="cardType">
        <el-select v-model="ruleForm.cardType" placeholder="请选择经办人类型" @change="changeCard">
          <el-option v-for="item in cardTypeOptions" :label="item.label" :value="item.value" :key="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件影印件" prop="cardFrontalPictureUri" v-if="ruleForm.cardType == 1">
        <el-upload
          class="upload-img"
          action="https://wxim.juketool.com/Files/Upload"
          v-model="ruleForm.cardFrontalPictureUri"
          :on-preview="handlePreview"
          :on-remove="handleRemoveCardFrontal"
          :on-change="handleChangeCardFrontal"
          :before-upload="beforeUpload"
          :file-list="cardFrontalFileList"
          list-type="picture">
          <el-button size="small">上传文件</el-button>
          <div slot="tip" class="el-upload__tip">必须为彩色图片且小于2M，文件格式为bmp、png、jpeg、jpg或gif</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="身份证正面照片" prop="cardFrontalPictureUri" v-if="ruleForm.cardType == 0">
        <el-upload
          class="upload-img"
          action="https://wxim.juketool.com/Files/Upload"
          v-model="ruleForm.cardFrontalPictureUri"
          :on-preview="handlePreview"
          :on-remove="handleRemoveCardFrontal"
          :on-change="handleChangeCardFrontal"
          :before-upload="beforeUpload"
          :file-list="cardFrontalFileList"
          list-type="picture">
          <el-button size="small">上传正面照</el-button>
          <div slot="tip" class="el-upload__tip">必须为彩色图片且小于2M，文件格式为bmp、png、jpeg、jpg或gif</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="身份证反面照片" prop="cardReversePictureUri" v-if="ruleForm.cardType == 0">
        <el-upload
          class="upload-img"
          action="https://wxim.juketool.com/Files/Upload"
          v-model="ruleForm.cardReversePictureUri"
          :on-preview="handlePreview"
          :on-remove="handleRemoveCardReverse"
          :on-change="handleChangeCardReverse"
          :before-upload="beforeUpload"
          :file-list="cardReverseFileList"
          list-type="picture">
          <el-button size="small">上传反面照</el-button>
          <div slot="tip" class="el-upload__tip">必须为彩色图片且小于2M，文件格式为bmp、png、jpeg、jpg或gif</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
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
  data() {
    let validateBussinessLicensePictureUri = (rule, value, callback) => {
      if (value.length < 1 ) {
        if (this.businessType == '政府及事业单位' || this.businessType == '其他组织') {
          callback(new Error('请上传证件照片'))
        } else {
          callback(new Error('请上传营业执照照片'))
        }
      }
      callback()
    }
    let validateCardType = (rule, value, callback) => {
      if (value.length < 1 ) {
        if (this.ruleForm.cardType == 1) {
          callback(new Error('请上传证件照片'))
        } else {
          callback(new Error('请上传经办人/法人身份证正面照片'))
        }
      }
      callback()
    }
    return {
      isInvalid: false,
      bussinessFileList: [],
      cardFrontalFileList: [],
      cardReverseFileList: [],
      cardTypeOptions: [
        {
          label: '身份证(限中国大陆居民)',
          value: 0
        },
        {
          label: '护照(限境外人士)',
          value: 1
        }
      ],
      ruleForm: {
        bussinessLicensePictureUri: this.configRuleForm.bussinessLicensePictureUri || '',
        cardFrontalPictureUri: this.configRuleForm.bussinessLicensePictureUri || '',
        cardReversePictureUri: this.configRuleForm.cardReversePictureUri || '',
        cardType: this.configRuleForm.cardType || 0
      },
      rules: {
        bussinessLicensePictureUri: [
          { required: true, validator: validateBussinessLicensePictureUri, trigger: 'change' }
        ],
        cardFrontalPictureUri: [
          { required: true, validator: validateCardType, trigger: 'change' }
        ],
        cardReversePictureUri: [
          { required: true, message: '请上传经办人/法人身份证反面照片', trigger: 'change' }
        ],
        cardType: [
          { required: true, message: '请选择证件类型', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    changeCard(val) {
      setTimeout(() => {
        this.$refs.ruleForm.validateField('cardFrontalPictureUri')
        this.$refs.ruleForm.validateField('cardReversePictureUri')
      }, 500)
    },
    handlePreview(file) {
      // console.log(file)
    },
    handleRemoveCardReverse(file, fileList) {
      this.cardReverseFileList = fileList
      this.ruleForm.cardReversePictureUri = ''
    },
    handleChangeCardReverse(file, fileList) {
      this.cardReverseFileList = fileList.slice(-1)
      if (file.response) {
        this.ruleForm.cardReversePictureUri = file.response.Url
        this.$refs.ruleForm.validateField('cardReversePictureUri')
      }
    },
    handleRemoveCardFrontal(file, fileList) {
      this.cardFrontalFileList = fileList
      this.ruleForm.cardFrontalPictureUri = ''
    },
    handleChangeCardFrontal(file, fileList) {
      this.cardFrontalFileList = fileList.slice(-1)
      if (file.response) {
        this.ruleForm.cardFrontalPictureUri = file.response.Url
        this.$refs.ruleForm.validateField('cardFrontalPictureUri')
      }
    },
    handleRemove(file, fileList) {
      this.bussinessFileList = fileList
      this.ruleForm.bussinessLicensePictureUri = ''
    },
    handleChange(file, fileList) {
      this.bussinessFileList = fileList.slice(-1)
      if (file.response) {
        this.ruleForm.bussinessLicensePictureUri = file.response.Url
      }
    },
    beforeUpload(file) {
      const isImg = file.type.indexOf("image/") != -1
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImg) {
        this.$message.error('请上传图片!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isImg && isLt2M
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
  watch: {
    configRuleForm(newVal) {
      this.ruleForm.bussinessLicensePictureUri = newVal.bussinessLicensePictureUri
      this.ruleForm.cardFrontalPictureUri = newVal.cardFrontalPictureUri
      this.ruleForm.cardReversePictureUri = newVal.cardReversePictureUri
      this.ruleForm.cardType = newVal.cardType == 'Identity' ? 0 : 1
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
    },
    cardLabelText() {
      if (this.businessType == '个体工商户') {
        return '法人证件类型'
      } else {
        return '经办人/法人证件类型'
      }
    },
    bussinessFile() {
      if (this.ruleForm && this.ruleForm.bussinessLicensePictureUri) {
        return [{
          url: this.ruleForm.bussinessLicensePictureUri
        }]
      } else {
        return []
      }
    },
    cardFrontalFile() {
      if (this.ruleForm && this.ruleForm.cardFrontalPictureUri) {
        return [{
          url: this.ruleForm.cardFrontalPictureUri
        }]
      } else {
        return []
      }
    },
    cardReverseFile() {
      if (this.ruleForm && this.ruleForm.cardReversePictureUri) {
        return [{
          url: this.ruleForm.cardReversePictureUri
        }]
      } else {
        return []
      }
    }
  },
  mounted () {
    console.log(this.ruleForm)
    this.bussinessFileList = this.bussinessFile
    this.cardFrontalFileList = this.cardFrontalFile
    this.cardReverseFileList = this.cardReverseFile
  }
}
</script>

<style lang="scss">
  .license-tip{
    line-height: 17px;
    padding-left: 156px;
    padding-right: 40px;
    font-size: 14px;
    color: #909399;
  }
  .upload-img{
    width: 380px;
  }
  .el-icon-question{
    color: #cccccc;
  }
  .el-select{
    width: 93%;
    .el-input{
      width: 97% !important;
    }
  }
  .panel-head{
    line-height: 50px;
    border-bottom: 1px solid #ebeef5;
  }
  .el-input{
    width: 90%;
    margin-right: 10px;
  }
  .merchant-ruleForm{
    width: 580px !important;
    padding-right: 62px;
  }
  .pay-ruleForm{
    // width: 560px;
    margin: 0 auto;
    margin-top: 98px;
  }
  .el-cascader{
    width: 93%;
    .el-input{
      width: 97% !important;
    }
  }
  .el-upload__tip{
    font-size: 14px;
    color: #909399;
    line-height: 16px;
    margin-top: 6px;
  }
  .upload-img{
    a{
      color: #159ae9;
      margin-left: 7px;
    }
  }
</style>
