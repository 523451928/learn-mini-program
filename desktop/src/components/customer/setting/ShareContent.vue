<template>
  <div>
    <div class="share-content">
      <p class="share-title">分享内容</p>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="share-ruleForm">
        <el-form-item label="是否开启分享功能" >
          <el-switch
            v-model="ruleForm.isEnable"
            active-color="#13ce66">
          </el-switch>
        </el-form-item>
        <el-form-item label="分享应用范围" >
          <el-checkbox-group 
            v-model="ruleForm.scopes"
            :min="1"
            :max="4">
            <el-checkbox v-for="item in shareList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
          <p class="tip">以下设置不包括商品详情页，商品详情页将直接应用商品名称和图片</p>
        </el-form-item>
        <el-form-item label="分享描述" prop="description">
          <el-input type="textarea" v-model="ruleForm.description" placeholder="商家名称" :autosize="{ minRows: 3, maxRows: 6}"></el-input>
          <span class="count-text" :class="{'danger-text': ruleForm.description.length > 30, 'default-text':  ruleForm.description.length > 0}">{{ruleForm.description.length}} / 30</span>
        </el-form-item>
        <el-form-item label="分享图片">
          <el-upload
            class="upload-img"
            action="https://wxim.juketool.com/Files/Upload"
            v-model="ruleForm.pictureUri"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :before-upload="beforeUpload"
            :file-list="fileList"
            list-type="picture">
            <!-- <el-button size="small">上传文件</el-button> -->
            <i class="el-icon-plus picture-uploader-icon">
              <p>
                添加图片
              </p>
            </i>
          </el-upload>
          <p class="tip" style="margin-top: 10px;">不设置情况下取当前分享页面图像，建议上传的图片长宽比为5：4，文件格式为png或jpg</p>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer-content">
      <el-button @click="reset">恢复默认</el-button>
      <el-button class="save-btn" type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import { trim } from '@/assets/js/utils'
export default {
  data () {
    return {
      storeId: localStorage.getItem('storeId'),
      fileList: [],
      ruleForm: {
        storeId: localStorage.getItem('storeId'),
        pictureUri: '',
        isEnable: true,
        description: '',
        scopes: [ 'HomeIndex', 'Catalog' ]
      },
      rules: {
        description: [
          { required: true, message: '请填写分享描述', trigger: 'blur' },
          {min: 1, max: 30, message: '请输入30字以内的分享描述', trigger: 'blur'}
        ]
      },
      shareList: [
        {
          label: '首页',
          value: 'HomeIndex'
        },
        {
          label: '分类',
          value: 'Catalog'
        },
        {
          label: '购物车',
          value: 'Basket'
        },
        {
          label: '我的',
          value: 'My'
        }
      ]
    }
  },
  methods: {
    getMpInfo() {
      this.$http.get('/api/wechat/miniapp', {
        params: {
          storeId: this.storeId
        }
      }).then((res) => {
        this.ruleForm.description = res.data.data.nickName
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getMpInfo()
        })
      })
    },
    save() {
      if (!this.ruleForm.pictureUri) this.ruleForm.pictureUri = null
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$http.put("/api/wechat/miniapp/forwardsetting", this.ruleForm).then((res) => {
            this.$message.success("保存成功")
          }).catch((err) => {
            this.loginAgain(err).then(() => {
              this.save()
            })
          })
        }
      })
    },
    reset() {
      this.$refs.ruleForm.resetFields()
      this.ruleForm = {
        pictureUri: '',
        isEnable: true,
        description: '',
        scopes: [ 'HomeIndex', 'Catalog' ]
      }
      this.getMpInfo()
      this.fileList = []
    },
    getShareContent() {
      this.$http.get(`/api/wechat/miniapp/forwardsetting/${this.storeId}`).then((res) => {
        let data = res.data.data
        if (data.pictureUri) this.fileList.push({url: data.pictureUri})
        this.ruleForm = JSON.parse(JSON.stringify(data))
        this.ruleForm.scopes = []
        let scopes = data.scopes.split(',')
        scopes.forEach((item) => {
          this.ruleForm.scopes.push(trim(item))
        })
        if (!this.ruleForm.description) {
          this.getMpInfo()
        }
      })
    },
    beforeUpload(file) {
      const isImg = file.type.indexOf("image/") != -1
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isImg) {
        this.$message.error('请上传图片!')
      }
      if (!isLt1M) {
        this.$message.error('请上传不超过1M的图片')
      }
      return isImg && isLt1M
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
      this.ruleForm.pictureUri = ''
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1)
      if (file.response) {
        this.ruleForm.pictureUri = file.response.Url
      }
    }
  },
  mounted() {
    this.getShareContent()
  }
}
</script>

<style lang="scss">
.footer-content{
  margin-top: 54px;
  padding-bottom: 20px;
  text-align: center;
  .save-btn{
    width: 98px;
  }
}
.picture-uploader-icon{
  width: 64px;
  height: 64px;
  border: 1px dashed #d9d9d9;
  box-sizing: border-box;
  padding-top: 8px;
  color: #ccc;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  // line-height: 56px;
  text-indent: 0;
  font-size: 26px;
  top: 10px;
  p{
    font-size: 12px;
    margin-top: 6px;
  }
}
.share-content{
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 30px 24px 60px 24px;
  .share-ruleForm{
    width: 800px;
    padding-left: 40px;
    .el-form-item{
      margin-bottom: 12px;
      .tip{
        color: #909399;
        line-height: 12px;
      }
      .el-textarea{
        margin-top: 10px;
        width: 360px;
        .el-textarea__inner{
          width: 100%;
        }
      }
    }
    .el-upload-list__item{
      width: 360px;
    }
  }
  .share-title{
    font-size: 20px;
    color: #303133;
    margin-bottom: 54px;
  }
  .count-text{
    position: absolute;
    left: 312px;
    bottom: -5px;
    color: #c9ccd3;
  }
  .default-text{
    color: #606266;
  }
  .danger-text{
    color: #F56C6C;
  }
}
</style>
