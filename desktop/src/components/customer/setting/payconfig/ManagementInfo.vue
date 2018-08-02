<template>
  <div class="panel-content">
    <div class="panel-head">经营信息</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="pay-ruleForm">
      <el-form-item label="商户简称" prop="merchantAbbreviation">
        <el-input type="text" v-model="ruleForm.merchantAbbreviation" auto-complete="off" placeholder=""></el-input>
        <el-popover
          placement="top"
          width="200"
          trigger="hover"
          class="mp-popover">
          <div>该简称将在支付完成页向买家展示，需与微信经营类目相关</div>
          <span class="el-icon-question" slot="reference"></span>
        </el-popover>
      </el-form-item>
      <el-form-item label="经营类型" prop="managementType">
        <el-cascader
          placeholder="经营类型"
          v-model="ruleForm.managementType"
          :options="businessType"
          @change="changeBusiness"
          filterable>
        </el-cascader>
        <el-popover
          placement="top"
          width="200"
          trigger="hover"
          class="mp-popover">
          <div>请根据你的营业执照和实际售卖商品来选择主体和类目，审核通过后类目不可修改。</div>
          <span class="el-icon-question" slot="reference"></span>
        </el-popover>
      </el-form-item>
      <label class="el-form-item__label" style="width: 100px;">特殊资质照片</label>
      <el-form-item>
        <el-upload
          class="upload-img"
          action="https://wxim.juketool.com/Files/Upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :before-upload="beforeUpload"
          :file-list="specialFileList"
          list-type="picture">
          <el-button size="small">上传文件</el-button>
          <a @click.stop href="http://kf.qq.com/faq/170807nY7Jbi170807Yf6jIB.html" target="_blank">查看特殊资质帮助</a>
          <div slot="tip" class="el-upload__tip">请查看各类目对应的特殊资质，建议根据特殊资质表提前进行准备齐全后进行申请。</div>
        </el-upload>
      </el-form-item>
      <label class="el-form-item__label" style="width: 100px;">补充材料</label>
      <el-form-item>
        <el-upload
          class="upload-img"
          multiple
          action="https://wxim.juketool.com/Files/Upload"
          :on-preview="handlePreview"
          :on-remove="supplementHandleRemove"
          :on-change="supplementHandleChange"
          :before-upload="beforeUpload"
          :file-list="supplementFileList"
          list-type="picture">
          <el-button size="small">上传文件</el-button>
          <a @click.stop href="http://kf.qq.com/faq/170807nY7Jbi170807Yf6jIB.html" target="_blank">查看补充材料说明</a>
          <div slot="tip" class="el-upload__tip">请上传相关照片或截图来说明你的售卖商品场景，另外，在整个申请流程中，遇到需提供资料但无上传入口的情况，都可在此处上传。必须为彩色图片（文档请截图后上传），最多5张，单张小于2M，格式为bmp、png、jpeg、jpg或gif"</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
import { businessType } from 'assets/json/businessType'
import { mapMutations } from 'vuex'
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
    specialFile() {
      if (this.ruleForm.specialCrendentialsUri) {
        return [{
          url: this.ruleForm.specialCrendentialsUri
        }]
      } else {
        return []
      }
    },
    supplementFile() {
      if (this.ruleForm.supplementaryPicUris) {
        let arr = this.ruleForm.supplementaryPicUris
        return arr.map((item) => {
          return {
            url: item
          }
        })
      } else {
        return []
      }
    }
  },
  data() {
    let validateManagementType = (rule, value, callback) => {
      if (value.length < 3 ) {
        callback(new Error('请选择经营类型'))
      }
      callback()
    }
    return {
      businessType,
      isInvalid: false,
      specialFileList: [],
      supplementFileList: [],
      ruleForm: {
        merchantAbbreviation: this.configRuleForm.merchantAbbreviation || '',
        managementType: this.configRuleForm.managementType ? this.configRuleForm.managementType.split('/') : [],
        specialCrendentialsUri: this.configRuleForm.specialCrendentialsUri,
        supplementaryPicUris: this.configRuleForm.supplementaryPicUris
      },
      rules: {
        merchantAbbreviation: [
          { required: true, message: '请输入商户简称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        managementType: [
          { validator: validateManagementType, type: 'array', required: true, trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    configRuleForm(newVal) {
      console.log(newVal)
      this.ruleForm.merchantAbbreviation = newVal.merchantAbbreviation
      this.ruleForm.managementType = newVal.managementType ? newVal.managementType.split('/') : [],
      this.ruleForm.specialCrendentialsUri = newVal.specialCrendentialsUri
      this.ruleForm.supplementaryPicUris = newVal.supplementaryPicUris
    }
  },
  methods: {
    ...mapMutations([
      'setBusinessType'
    ]),
    changeBusiness(val) {
      this.setBusinessType(val[0])
    },
    supplementHandleRemove(file, fileList) {
      let fileArr = []
      this.supplementFileList = fileList
      this.formatUrl()
    },
    supplementHandleChange(file, fileList) {
      this.supplementFileList = fileList.slice(-5)
      this.formatUrl()
    },
    formatUrl() {
      let arr = []
      this.supplementFileList.forEach((item) => {
        if (item.response) {
          arr.push(item.response.Url)
        }
      })
      this.ruleForm.supplementaryPicUris = arr
    },
    handleRemove(file, fileList) {
      this.specialFileList = fileList
      this.ruleForm.specialCrendentialsUri = null
    },
    handlePreview(file) {
      // console.log(file)
    },
    handleChange(file, fileList) {
      this.specialFileList = fileList.slice(-1)
      if (file.response) {
        this.ruleForm.specialCrendentialsUri = file.response.Url
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
  mounted () {
    this.specialFileList = this.specialFile
    this.supplementFileList = this.supplementFile
  }
}
</script>

<style lang="scss">
  .upload-img{
    width: 380px;
  }
  .el-icon-question{
    color: #cccccc;
  }
  .el-select{
    width: 100%;
  }
  .panel-head{
    line-height: 50px;
    border-bottom: 1px solid #ebeef5;
  }
  .el-input{
    width: 90%;
    margin-right: 10px;
  }
  .pay-ruleForm{
    width: 520px;
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
