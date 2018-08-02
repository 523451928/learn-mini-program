<template>
  <div class="setting-swiper setting-wrapper">
    <div class="setting-head">
      设置分类页面
      <span @click="changeSettingName('selectClassify')" class="fr switch-classify">
        <span class="el-icon-sort"></span>
        切换分类
      </span>
    </div>
    <div class="classify-content">
      <table>
        <thead>
          <tr>
            <td>分类名称</td>
            <td>分类图片</td>
            <td>分组链接</td>
            <td>操作</td>
          </tr>
        </thead>
        <draggable class="default-drag" element="tbody" v-model="classifyList" :options="dragOptions"> 
          <tr v-for="(item, index) in classifyList" :key="index" >
            <td>
              <el-input v-model="item.classifyName" placeholder="一级分类" maxlength="8"></el-input>
            </td>
            <td>
               <el-upload
               @click.native.stop="changeEditIndex(index)"
                class="avatar-uploader"
                :class="{'has-img': item.imgUrl}"
                action="https://wxim.juketool.com/Files/Upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="item.imgUrl" :src="item.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </td>
            <td>
               <mp-select v-model="item.groupId" :options="groupOptions" :props="optionsProps" filterable placeholder="选择分组"></mp-select>
            </td>
            <td>
              <el-button type="text" @click="deleteClassify(index)">删除</el-button>
            </td>
          </tr>
        </draggable>
      </table>
      <el-button style="margin-top:10px;" @click="addClassify" :disabled="classifyList.length >= 30">添加分类</el-button>
      <span class="img-tips">最多可有30个一级分类</span>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import MpSelect from '@/components/public/MpSelect'
import { formatGroup, dragOptions } from 'assets/js/utils'
export default {
  props: {
    
  },
  data() {
    return {
      dragOptions,
      optionsProps: {
        label: 'name',
        value: 'groupId'
      },
      groupOptions: [],
      groupObj: {},
      editIndex: -1,
      classifyList: [

      ]
    }
  },
  watch: {
    classifyList: {
      handler(newVal) {
        if (newVal) {
          this.setClassifyListA(newVal)
          this.submit()
        }
      },
      // immediate: true,
      deep: true
    },
    classifyListA(newVal) {
      this.classifyList = newVal
    }
  },
  computed: {
    ...mapState([
      'classifyListA'
    ])
  },
  components: {
    MpSelect
  },
  methods: {
    ...mapMutations([
      'changeSettingName', 'setClassifyListA'
    ]),
    submit() {

    },
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
    rendenClassifyList() {
      if (this.classifyList.length > 0 || this.classifyListA && this.classifyListA.length > 0) {
        return
      }
      let obj = {
        classifyName: '',
        imgUrl: '',
        groupId: ''
      }
      for (let i = 0;i < 6;i++) {
        this.classifyList.push(JSON.parse(JSON.stringify(obj)))
      }
    },
    deleteClassify(index) {
      this.$confirm('确认要删除该分类吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // type: 'warning',
        center: true
      }).then(() => {
        this.classifyList.splice(index, 1)
      }).catch(() => {

      })
    },
    addClassify() {
      if (this.classifyList.length >=30) {
        this.$message.warning('最多可有30个一级分类')
        return
      }
      this.$nextTick(() => {
        setTimeout(() => {
          let classifyDom = document.querySelector('.classify-content')
          classifyDom.scrollTop = classifyDom.scrollHeight
        }, 100)
      })
      this.classifyList.push({
        classifyName: '',
        imgUrl: '',
        groupId: ''
      })
    },
    changeEditIndex(index) {
      this.editIndex = index
    },
    handleAvatarSuccess(res, file) {
      this.classifyList[this.editIndex].imgUrl = res.Url
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
    if (this.classifyListA) {
      this.classifyList = this.classifyListA
    }
    this.rendenClassifyList()
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
  .classify-content{
    height: 550px;
    overflow-y: auto;
    @include scrollBar;
    table{
      width: 100%;
      td{
        text-indent: 10px;
      }
      thead{
        line-height: 40px;
        font-size: 14px;
        color: #7d8087;
        font-weight: bold;
        border-bottom: 1px solid #ebeef5;
      }
      tbody{
        tr{
          line-height: 72px;
          border-bottom: 1px solid #ebeef5;
          .el-input{
            width: 160px;
          }
          .mp-select{
            text-indent: 0;
            .el-input{
              position: initial;
            }
            .el-input__suffix{
              right: 47px;
            }
            .select-val{
              top: 0;
              z-index: 0;
            }
            .mp-select-content{
              top: 61px;
            }
            .mp-arrow{
              top: 55px;
            }
          }
          .avatar-uploader{
            width: 56px;
            height: 56px;
            line-height: 56px;
            text-align: center;
            text-indent: 0;
            display: inline-block;
            border: 1px dashed #eceef2;
            border-radius: 4px;
            font-size: 18px;
            font-weight: bold;
            color: #c0c4cc;
            img{
              width: 100%;
            }
          }
          .has-img{
            position: relative;
            top: 8px;
          }
        }
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
            vertical-align: top;
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
    margin-bottom: 10px;
    .switch-classify{
      font-size: 14px;
      color: #459ae9;
      cursor: pointer;
      .el-icon-sort{
        transform: rotate(90deg);
      }
    }
  }
  .delete-btn{
    cursor: pointer;
    font-size: 14px;
    color: #1989fa;
  }
  .img-tips{
    font-size: 14px;
    color: #909399;
    margin-left: 5px;
  }
}

</style>
