<template>
  <div class="create-box">
    <div class="create-wrapper">
      <div class="create-shop">
        <div class="info-text">店铺基本信息</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <label for="name" class="el-form-item__label" style="width: 100px;">店铺logo</label>
          <el-upload
            class="avatar-uploader"
            action="https://wxim.juketool.com/Files/Upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" @click.stop.prevent="previewImg(imageUrl)" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <span class="modify-text" :class="{'has-avatar': imageUrl}">修改</span>
          </el-upload>
          <div class="upload-tips">图片大小在2M以内，建议尺寸144pxX144px</div>
          <el-form-item label="店铺名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="填写店铺名称"></el-input>
          </el-form-item>
          <el-form-item label="店铺行业" prop="industry">
            <el-cascader
              placeholder="选择店铺行业"
              v-model="ruleForm.industry"
              :options="category"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="店铺地址" prop="area">
            <el-cascader
              placeholder="选择省/市/区"
              v-model="ruleForm.area"
              :options="area"
              filterable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="店铺简介" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc" placeholder="最多300字" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
            <span class="count-text" :class="{'danger-text': ruleForm.desc.length > 300, 'default-text':  ruleForm.desc.length > 0}">{{ruleForm.desc.length}} / 300</span>
          </el-form-item>
          <el-form-item label="店铺状态" prop="status">
            <el-switch v-model="ruleForm.status" active-color="#13ce66"
              inactive-color="#d7d7d7"
              active-text="营业中"
              inactive-text="打烊"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="full-btn" :disabled="disable" @click="submitForm('ruleForm')">{{isCreate ? '修改店铺' : '创建店铺'}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="preview-img" @click="isPreview = false" v-show="isPreview">
        <img :src="imageUrl" @click.stop.prevent>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex'
import { area } from 'assets/json/area'
import { category } from 'assets/json/category'
export default {
  computed: {
    ...mapState([
      'storeObj'
    ])
  },
  data() {
    let validateIndustry = (rule, value, callback) => {
      if (value.length < 2 ) {
        callback(new Error('请选择店铺行业'))
      }
      callback()
    }
    let validateArea = (rule, value, callback) => {
      if (value.length < 3 ) {
        callback(new Error('请选择省市区'))
      }
      callback()
    }
    return {
      area,
      category,
      disable: false,
      isCreate: false,
      isPreview: false,
      imageUrl: 'https://imgcache.mysodao.com/img3/M04/2A/10/CgAPEFtL7YeCdIJsAAAEnKR4rdQ039-yfs3ecb.png',
      imgUrl: 'https://imgcache.mysodao.com/img3/M04/2A/10/CgAPEFtL7YeCdIJsAAAEnKR4rdQ039-yfs3ecb.png',
      props: {
        value: 'label',
        label: 'label'
      },
      ruleForm: {
        name: '',
        industry: [],
        status: true,
        area: [],
        desc: '',
        storeId: 0
      },
      rules: {
        name: [
          { required: true, message: '请填写店铺名称', trigger: 'blur' },
          { min: 1, max: 30, message: '请填写30字以内的店铺名称', trigger: 'blur' }
        ],
        industry: [
          { validator: validateIndustry, type: 'array', required: true, trigger: 'change' }
        ],
        area: [
          { validator: validateArea, type: 'array', required: true, message: '请选择店铺地址', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写店铺简介', trigger: 'blur' },
          { min: 1, max: 300, message: '请填写300字以内的店铺简介', trigger: 'blur' }
        ],
        status: [
          { required: true }
        ]
      }
    }
  },
  methods: {
    checkCanCreateShop() {
      this.$http.get('/api/store/summarys', {
        Name: '',
        UId: '',
        pageIndex: 1,
        pageSize: 10
      }).then((res) => {
        if (res.data.data.totalDataCount >= 2 && !this.$router.currentRoute.query.storeId) {
          this.$router.push('/selectshop')
        }
      })
    },
    previewImg(url) {
      this.isPreview = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let formData = {
            "storeName": this.ruleForm.name,
            "storeLogoUri": this.imgUrl,
            "industry": this.ruleForm.industry.join('/'),
            "introduction": this.ruleForm.desc,
            "province": this.ruleForm.area[0],
            "city": this.ruleForm.area[1],
            "area": this.ruleForm.area[2],
            "status": this.ruleForm.status ? "Ok" : "Closed"
          }
          this.disable = true
          if (!this.isCreate) {
            this.$http.post('/api/store', formData).then((res) => {
              this.$message.success('创建成功')
              this.$router.push('/selectshop')
              this.disable = false
            }).catch((err) => {
              if (err.response.status == '401') {
                window.location.href = '../user/user.html'
              }
            })
          } else {
            formData.storeId = this.storeObj.storeId || this.ruleForm.storeId
            this.$http.put('/api/store', formData).then((res) => {
              this.$message.success('修改成功')
              this.$router.push('/selectshop')
              this.disable = false
            }).catch((err) => {
              this.loginAgain(err).then(() => {
                this.submitForm(formName)
              })
            })
          }
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.imgUrl = res.Url
    },
    beforeAvatarUpload(file) {
      const isImg = file.type.indexOf("image/") != -1
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImg) {
        this.$message.error('请上传图片!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isImg && isLt2M
    }
  },
  mounted() {
    this.area.forEach((province) => {
      province.value = province.label
      province.children.forEach((city) => {
        city.value = city.label
        if (city.children) {
          city.children.forEach((area) => {
            area.value = area.label
          })
        }
      })
    })
    let storeId = this.$router.currentRoute.query.storeId
    this.checkCanCreateShop()
    let storeObj = this.storeObj
    if (storeObj.area) {
      document.title = '修改店铺'
      this.isCreate = true
      this.imgUrl = storeObj.logoUri
      this.imageUrl = storeObj.logoUri
      this.ruleForm = {
        name: storeObj.storeName,
        industry: storeObj.industry.split('/'),
        status: storeObj.status ? false : true,
        area: [storeObj.province, storeObj.city, storeObj.area],
        desc: storeObj.introduction
      }
    } else if (storeId) {
      this.$http.get(`/api/store/details/${storeId}`).then((res) => {
        document.title = '修改店铺'
        this.isCreate = true
        storeObj = res.data.data
        this.imgUrl = storeObj.storeLogoUri
        this.imageUrl = storeObj.storeLogoUri
        this.ruleForm = {
          name: storeObj.storeName,
          industry: storeObj.industry.split('/'),
          status: storeObj.status ? false : true,
          area: [storeObj.province, storeObj.city, storeObj.area],
          desc: storeObj.introduction,
          storeId
        }
      })
    }
  }
}
</script>

<style lang="scss">
.el-switch__label{
  color: #606266 !important;
  &.is-active{
    color: #606266 !important;
  }
}
.el-form-item__label{
  padding-right: 24px;
}
.preview-img{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0,0,0,.6);
  img{
    width: 280px;
    height: 280px;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.create-box{
   padding: 0 20px;
   height: 90%;
  .create-wrapper{
    position: relative;
    height: auto;
    min-height: 96%;
    vertical-align: baseline;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    .create-center{
      position: absolute;
      text-align: center;
      width: 100%;
      top: 150px;
      p{
        margin-bottom: 20px;
      }
    }
  }
  .create-shop{
    width: 400px;
    margin: 0 auto;
    padding-top: 118px;
    padding-bottom: 20px;
    .el-cascader{
      width: 100%;
    }
    .full-btn{
      width: 100%;
      margin-top: 16px;
    }
    .info-text{
      text-align: center;
      margin-bottom: 56px;
      font-size: 20px;
    }
    .count-text{
      position: absolute;
      right: 3px;
      bottom: 0;
      color: #c9ccd3;
    }
    .default-text{
      color: #606266;
    }
    .danger-text{
      color: #F56C6C;
    }
    .modify-text{
      position: relative;
      top: -6px;
      font-size: 14px;
      color: #159ae9;
      margin-left: 24px;
    }
    .has-avatar{
      top: -21px;
    }
    .upload-tips{
      color: #c9ccd3;
      font-size: 14px;
      margin-left: 100px;
      padding: 4px 0 20px 0;
    }
    .avatar{
      display: inline-block;
    }
  }
}
.avatar-uploader .el-upload {
  // border: 1px dashed #d9d9d9;
  // border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 48px;
  height: 48px;
  line-height: 48px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  text-align: center;
}
.avatar {
  width: 48px;
  height: 48px;
  display: block;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
