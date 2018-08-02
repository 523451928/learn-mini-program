<template>
  <div class="setting-category setting-wrapper">
    <div class="setting-head">
      设置分类页面
      <span @click="deleteComponent" class="fr delete-btn">
        <span class="el-icon-delete"></span>
        删除
      </span>
    </div>
    <div class="category-list">
      <div class="category-content">
        <draggable class="default-drag" element="div" v-model="categoryList" :options="dragOptions"> 
          <div v-for="(item, index) in categoryList" :key="index" class="category-item">
            <div class="category-name">
              <span class="label-text">分类名称</span>
              <el-input v-model="item.categoryName" maxlength="5" placeholder="分类名称"></el-input>
            </div>
            <div class="img-upload group-img">
              <span class="label-text">分类图片</span>
              <el-upload
                @click.native.stop="changeEditIndex(index)"
                class="avatar-uploader"
                action="https://wxim.juketool.com/Files/Upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="item.imgUrl" :src="item.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <div class="goods-group">
              <span class="label-text">商品分组</span>
              <mp-select v-model="item.groupId" :options="groupOptions" :props="optionsProps" filterable placeholder="选择分组"></mp-select>
            </div>
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import MpSelect from '@/components/public/MpSelect'
import { formatGroup, dragOptions } from 'assets/js/utils'
export default {
  props: {
    categoryOptions: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    MpSelect
  },
  data() {
    return {
      dragOptions,
      editIndex: -1,
      optionsProps: {
        label: 'name',
        value: 'groupId'
      },
      groupObj: {},
      groupOptions: [],
      categoryList: this.categoryOptions
      // categoryOptions: [
        // {
        //   imgUrl: '',
        //   categoryName: '',
        //   groupId: ''
        // },
        // {
        //   imgUrl: '',
        //   categoryName: '',
        //   groupId: ''
        // },
        // {
        //   imgUrl: '',
        //   categoryName: '',
        //   groupId: ''
        // },
        // {
        //   imgUrl: '',
        //   categoryName: '',
        //   groupId: ''
        // }
      // ]
    }
  },
  watch: {
    categoryList: {
      handler(newVal) {
        this.submit()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getGroupObj() {
      return this.$http.get('/api/product/group/summarys', {params: {
        storeId: localStorage.getItem('storeId')
      }}).then((res) => {
        this.groupObj = res.data.data
        this.groupOptions = formatGroup(this.groupObj.currentPageDatas)
        return Promise.resolve(this.groupObj.currentPageDatas)
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getGroupObj()
        })
      })
    },
    deleteComponent() {
      this.$emit('deleteComponentBySetting')
    },
    deleteImg(index) {
      this.imgOptions.splice(index, 1)
      
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
      this.$emit('changeCategory', this.categoryList)
    },
    changeEditIndex(index) {
      this.editIndex = index
    },
    handleAvatarSuccess(res, file) {
      this.categoryList[this.editIndex].imgUrl = res.Url
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
    this.getGroupObj()
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
  .category-content{
    margin-top: 18px;
    height: 550px;
    overflow-y: auto;
    @include scrollBar;
    .mp-select{
      margin-right: 0;
    }
    .select-val{
      top: 10px;
    }
    .category-item{
      background: #f5f8fc;
      padding: 20px;
      height: 186px;
      margin-bottom: 8px;
      .goods-group{
        .mp-select{
          vertical-align: top;
          top: -8px;
          width: 314px;
        }
      }
      .mp-input{
        margin: 0 20px;
      }
      .el-button--default{
        margin-left: 20px;
      }
      .mp-link{
        padding: 0 5px;
        margin-top: 18px;
        margin-right: 50px;
      }
      .mp-select-wrapper{
        min-height: 160px;
        height: 240px;
        position: relative;
        color: #606266;
        z-index: 100;
        width: 106%;
        left: -4px;
        top: -45px;
      }
      .mp-select-content{
        max-height: 150px;
        overflow-y: auto;
      }
      .category-name{
        margin-bottom: 16px;
        .el-input{
          width: 314px;
        }
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
          .el-upload{
            width: 66px;
          }
          img{
            width: 100%;
            height: 66px;
          }
        }
        span{
          vertical-align: top;
        }
        .avatar-uploader{
          display: inline-block;
        }
      }
      .group-img{
        margin-bottom: 25px;
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
