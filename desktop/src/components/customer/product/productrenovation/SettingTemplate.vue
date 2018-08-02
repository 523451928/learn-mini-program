<template>
  <div class="setting-swiper setting-wrapper">
    <div class="setting-head">
      设置轮播图
      <span @click="deleteComponent" class="fr delete-btn">
        <span class="el-icon-delete"></span>
        删除
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    
  },
  data() {
    return {
      editIndex: -1
    }
  },
  watch: {
   
  },
  methods: {
    deleteComponent() {
      this.$emit('deleteComponentBySetting')
    },
    deleteImg(index) {
      this.imgOptions.splice(index, 1)
      this.$emit('changeImg', this.imgOptions, this.swiperHeight)
    },
    addImg() {
      if (this.imgOptions.length >=5) {
        this.$message.warning('最多添加5张图')
        return
      }
      this.imgOptions.push({
        url: '',
        href: ''
      })
    },
    submit() {
      this.$emit('changeImg', this.imgOptions, this.swiperHeight)
    },
    changeEditIndex(index) {
      this.editIndex = index
    },
    handleAvatarSuccess(res, file) {
      this.imgOptions[this.editIndex].url = res.Url
      this.submit()
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) this.$message.error('上传头像图片只能是 JPG 格式!')
      if (!isLt2M) this.$message.error('上传头像图片大小不能超过 2MB!')
      return isJPG && isLt2M
    }
  },
  mounted() {
    
  }
}
</script>

<style lang="scss">
@import '~@/assets/css/mixin.scss';
.setting-wrapper{
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  background: #fff;
  padding: 20px 30px;
  .img-content{
    height: 550px;
    overflow-y: auto;
    @include scrollBar;
    .img-item{
      background: #f5f8fc;
      padding: 20px;
      margin-bottom: 8px;
      .el-upload{
        
      }
      .img-upload{
        vertical-align: top;
        margin-bottom: 16px;
        .avatar-uploader{
          text-align: center;
          display: inline-block;
          width: 66px;
          height: 66px;
          border: 1px dashed #e0e3ea;
          background: #fff;
          line-height: 66px;
          border-radius: 4px;
          img{
            width: 100%;
          }
        }
        span{
          vertical-align: top;
        }
        .avatar-uploader{
          display: inline-block;
        }
      }
    }
    .label-text{
      display: inline-block;
      text-align: right;
      color: #606266;
      font-size: 14px;
      margin-right: 10px;
      width: 60px;
    }
  }
  .swiper-height{
    line-height: 68px;
    font-size: 14px;
    color: #606266;
    .el-input-number{
      width: 120px;
      .el-input__inner{
        text-align: left !important;
      }
    }
    span{
      margin-left: 14px;
    }
  }
  .setting-head{
    color: #303133;
    font-size: 16px;
  }
  .img-tips{
    font-size: 14px;
    color: #909399;
    margin-left: 5px;
  }
  .delete-btn{
    cursor: pointer;
    font-size: 14px;
    color: #1989fa;
  }
}

</style>
