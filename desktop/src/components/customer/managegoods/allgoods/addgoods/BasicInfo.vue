<template>
  <div class="panel-content">
    <div class="panel-head">基本信息</div>
    <div class="spec-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="pay-ruleForm">
        <el-form-item label="商品名称" prop="title">
          <el-input type="text" v-model="ruleForm.title" auto-complete="off" placeholder="40字以内">
          </el-input>
        </el-form-item>
        <el-form-item label="商品分组">
          <mp-select v-model="ruleForm.groupId" :options="groupOptions" @change="changeGroup" :props="optionsProps" filterable></mp-select>
          <div class="el-upload__tip">未选择将默认分组至“未分组”</div>
        </el-form-item>
        <el-form-item label="商品图片" prop="pictureUris">
          <el-upload
            class="upload-img"
            multiple
            action="https://wxim.juketool.com/Files/Upload"
            :on-remove="supplementHandleRemove"
            :on-change="supplementHandleChange"
            :before-upload="beforeUpload"
            :file-list="pictureUris"
            list-type="picture">
            <el-button size="small">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">建议尺寸640x640像素，大小2M以内，最多5张</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import MpSelect from 'components/public/MpSelect'
import { trim, formatGroup } from 'assets/js/utils'
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
  components: {
    MpSelect
  },
  data() {
    let validateMobile = (rule, value, callback) => {
      if (!mobileReg.test(value)) {
        callback(new Error('手机号不正确或号码所在号段暂不支持，请检查后重试'))
      }
      callback()
    }
    return {
      optionsProps: {
        label: 'name',
        value: 'groupId'
      },
      groupObj: {},
      groupId: '',
      groupOptions: [],
      pictureUris: [],
      ruleForm: {
        groupId: this.configRuleForm.groupId || '',
        title: this.configRuleForm.title,
        pictureUris: this.configRuleForm.pictureUris || []
      },
      isValid: false,
      rules: {
        title: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
        ],
        pictureUris: [
          { required: true, trigger: 'blur', message: '请上传商品图片' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    formatUrl() {
      let arr = []
      this.pictureUris.forEach((item) => {
        if (item.response) {
          arr.push(item.response.Url)
        } else {
          arr.push(item.url)
        }
      })
      this.ruleForm.pictureUris = arr
    },
    changeGroup(val) {
      this.ruleForm.groupId = val
    },
    supplementHandleRemove(file, fileList) {
      this.pictureUris = fileList
      this.formatUrl()
    },
    supplementHandleChange(file, fileList) {
      this.pictureUris = fileList.slice(-5)
      this.formatUrl()
      this.validateForm()
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
    addSpec() {
      this.isAddVisible = true
      this.specForm.specName = ''
      this.specForm.specValue = ''
    },
    validateForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.isValid = true
          return true
        } else {
          this.isValid = false
          return false
        }
      })
    },
    getGroupObj() {
      return this.$http.get('/api/product/group/summarys', {params: {
        storeId: localStorage.getItem('storeId')
      }}).then((res) => {
        this.groupObj = res.data.data
        this.groupOptions = formatGroup(this.groupObj.currentPageDatas)
        this.groupOptions.unshift({
          name: '未分组',
          groupId: null
        })
        return Promise.resolve(this.groupObj.currentPageDatas)
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getGroupObj()
        })
      })
    }
  },
  watch: {
    configRuleForm(newVal) {
      this.ruleForm.groupId = newVal.groupId
      this.ruleForm.title = newVal.title
      let arr = []
      newVal.pictureUris.forEach((item) => {
        arr.push({
          url: item
        })
      })
      this.pictureUris = arr
      this.ruleForm.pictureUris = newVal.pictureUris
    }
  },
  computed: {
   
  },
  mounted () {
    this.getGroupObj()
  }
}
</script>

<style lang="scss">
.mp-select{
  width: 420px;
  .el-input{
    width: 100% !important;
  }
  .select-val{
    top: 0 !important;
  }
}
.el-upload__tip{
  line-height: 1;
  color: #909399;
}
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
