<template>
  <div class="setting-swiper setting-wrapper">
    <div class="setting-head">
      设置轮播图
      <span @click="deleteComponent" class="fr delete-btn">
        <span class="el-icon-delete"></span>
        删除
      </span>
    </div>
    <div class="swiper-height">
      高度 <el-input-number :controls="false" v-model="swiperHeight"></el-input-number> px <span>建议尺寸180-400px</span>
    </div>
    <div class="img-content">
      <draggable class="default-drag" element="div" v-model="imgOptions" :options="dragOptions"> 
        <div v-for="(item, index) in imgOptions" :key="index" class="img-item">
          <div class="img-upload">
            <span class="label-text">图片</span>
            <el-upload
              @click.native.stop="changeEditIndex(index)"
              class="avatar-uploader"
              action="https://wxim.juketool.com/Files/Upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="item.url" :src="item.url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span v-if="index != 0" class="fr delete-btn" @click="deleteImg(index)">删除</span>
          </div>
          <div class="img-url">
            <span class="label-text">商品链接</span>
            <el-button v-if="!item.href" @click="chooseGoods(index)">选择链接</el-button>
            <el-tag v-else closable :title="item.goodsName" type="info" @close="handleClose(item)">{{item.goodsName}}</el-tag>
          </div>
        </div>
      </draggable>
      <el-button style="margin-top:10px;" @click="addImg">添加图片</el-button>
      <span class="img-tips">最多可添加5张轮播图</span>
    </div>
    <select-goods ref="selectGoods" @selectGoods="confirmSelectGoods"></select-goods>
    <!-- <el-button @click="submit">提交</el-button> -->
  </div>
</template>

<script>
import SelectGoods from './SelectGoods'
import { dragOptions } from '@/assets/js/utils'
export default {
  props: {
    imgsOptions: {
      type: Array,
      default() {
        return []
      }
    },
    height: [String, Number]
  },
  components: {
    SelectGoods
  },
  data() {
    return {
      dragOptions,
      imgOptions: [
        {
          url: '',
          href: ''
        },
        {
          url: '',
          href: ''
        },
        {
          url: '',
          href: ''
        }
      ],
      editIndex: -1,
      swiperHeight: 200
    }
  },
  watch: {
    imgsOptions(newVal) {
      this.imgOptions = newVal
    },
    height(newVal) {
      this.swiperHeight = newVal
      this.submit()
    },
    swiperHeight() {
      this.submit()
    },
    imgOptions(newVal) {
      this.submit()
    }
  },
  methods: {
    handleClose(item) {
      item.href = ''
      this.submit()
    },
    confirmSelectGoods(item) {
      this.imgOptions[this.editIndex].href = item.productId
      this.imgOptions[this.editIndex].goodsName = item.title
      this.submit()
    },
    chooseGoods(index) {
      this.editIndex = index
      this.$refs.selectGoods.show()
    },
    deleteComponent() {
      this.$emit('deleteComponentBySetting')
    },
    deleteImg(index) {
      this.$confirm('确认要删除这张图片吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // type: 'warning',
        center: true
      }).then(() => {
        this.imgOptions.splice(index, 1)
        this.$emit('changeImg', this.imgOptions, this.swiperHeight)
      }).catch(() => {

      })
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
      const isImg = file.type.indexOf("image/") != -1
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isImg) {
        this.$message.error('请上传图片!')
      }
      if (!isLt1M) {
        this.$message.error('超出文件大小限制，请上传不超过1024k的图片')
      }
      return isImg && isLt1M
    }
  },
  mounted() {
    if (this.imgsOptions.length > 0) {
      this.imgOptions = this.imgsOptions
    }
    this.swiperHeight = this.height
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
    .el-tag{
      width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      vertical-align: middle;
      .el-icon-close{
        position: absolute;
        top: 7px;
        right: 2px;
      }
    }
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
      color: #909399;
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
