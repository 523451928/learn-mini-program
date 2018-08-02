<template>
  <div class="panel-content">
    <div class="panel-head">基本信息</div>
    <div class="spec-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="pay-ruleForm">
        <el-form-item label="商品编码" prop="phoneNumber">
          <el-input type="text" v-model="ruleForm.phoneNumber" auto-complete="off" placeholder="">
          </el-input>
        </el-form-item>
        <el-form-item label="常用邮箱" prop="emailAddress">
          <el-input type="text" v-model="ruleForm.emailAddress" auto-complete="off" placeholder=""></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mobileReg, emailReg } from 'assets/js/utils.js'
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
    let validateMobile = (rule, value, callback) => {
      if (!mobileReg.test(value)) {
        callback(new Error('手机号不正确或号码所在号段暂不支持，请检查后重试'))
      }
      callback()
    }
    return {
      ruleForm: {
        appId: this.configRuleForm.appId,
        contacter: this.configRuleForm.contacter || '',
        phoneNumber: this.configRuleForm.phoneNumber || '',
        emailAddress: this.configRuleForm.emailAddress || ''
      },
      rules: {
        contacter: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleChangePic(file, fileList) {
      console.log(file)
      if (file.response) {
        this.editItem.sku.pictureUri = file.response.Url
        console.log(this.editItem)
      }
    },
    beforeAvatarUpload(file, item) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    addSpec() {
      this.isAddVisible = true
      this.specForm.specName = ''
      this.specForm.specValue = ''
    },
    validateForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          return true
        } else {
          return false
        }
      })
    }
  },
  computed: {
   
  }
}
</script>

<style lang="scss">
.panel-content{
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  background: #fff;
  margin-bottom: 24px;
  padding-bottom: 30px;
  .specification-content{
    margin-top: -12px;
  }
  .table-content{
    margin-left: 100px;
    margin-top: 20px;
    .batch-setting{
      font-size: 14px;
      .batch-text{
        color: #7d8087;
        font-weight: bold;
        margin-right: 70px;
        margin-left: 15px;
      }
      .el-input{
        width: 110px;
        margin-right: 23px;
      }
      .el-button--primary{
        margin-left: 0;
      }
    }
    table{
      width: 100%;
      tr{
        line-height: 44px;
        border-bottom: 1px solid #ebeef5;
        td{
          margin: 10px;
          vertical-align: middle;
          text-indent: 15px;
          font-size: 14px;
          color: #7d8087;
          font-weight: bold;
        }
      }
      tbody{
        tr{
          line-height: 70px;
          td{
            color: #4d4f53;
            font-weight: normal;
            .avatar-uploader{
              height: 70px;
            }
            .avatar-uploader-icon{
              width: 56px;
              height: 56px;
              border: 1px dashed #d9d9d9;
              border-radius: 6px;
              cursor: pointer;
              position: relative;
              overflow: hidden;
              line-height: 56px;
              text-indent: 0;
              top: 5px;
              left: -15px;
            }
            img{
              height: 60px;
              margin-top: 5px;
            }
            .el-input{
              width: 110px;
              margin: 0;
              text-indent: 0;
            }
          }
        }
      }
    }
  }
  .spec-container{
    padding: 40px 10px 40px 55px;
    .el-button-primary{
      margin-left: 96px;
    }
    .add-btn{
      margin-top: 25px;
    }
  }
  .spec-item{
    margin-left: 98px;
    p{
      line-height: 40px;
      color: #606266;
      font-weight: bold;
      font-size: 14px;
      margin-top: 12px;
    }
    .tag{
      margin-right: 10px;
      display: inline-block;
      padding: 12px 20px;
      font-size: 14px;
      border: 1px solid #dcdfe5;
      border-radius: 4px;
      cursor: pointer;
      color: #606266;
    }
    .checked{
      color: red;
    }
  }
  .specForm{
    width: 490px;
    margin-top: 24px;
  }
  .input-with-append{
    width: 250px !important;
  }
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
  }
}
</style>
