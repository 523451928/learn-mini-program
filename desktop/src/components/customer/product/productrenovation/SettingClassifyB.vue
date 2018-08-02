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
      </table>
      <el-collapse v-model="activeNames" v-if="classifyList.length">
        <draggable class="default-drag" element="div" v-model="classifyList" :options="dragOptions"> 
          <el-collapse-item v-for="(item, index) in classifyList" :key="item.name" :name="index" >
            <template slot="title">
              <span class="group-name" @click.stop.prevent >
                <el-input v-model="item.supName" placeholder="一级分类" maxlength="6"></el-input>
              </span>
              <span class="fr mp-link" @click.stop.prevent="deleteSupClassify(item, index)">删除</span>
            </template>
            <draggable class="children-classify" element="div" v-model="item.children" :options="dragOptions"> 
            <!-- <div v-if="item.children" class="children-classify"> -->
              <div v-for="(classify, idx) in item.children" :key="idx" class="classify-item">
                <span><el-input class="mp-input" v-model="classify.name" placeholder="二级分类" maxlength="8"></el-input></span>
                <el-upload
                  @click.native.stop="changeEditIndex(index, idx)"
                  class="avatar-uploader"
                  action="https://wxim.juketool.com/Files/Upload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="classify.imgUrl" :src="classify.imgUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <mp-select placeholder="选择分组" :class="{'last-select': idx == item.children.length - 1}" v-model="classify.groupId" :options="groupOptions" :props="optionsProps" filterable></mp-select>
                <span @click="deleteSubClassify(classify, idx, index)" class="fr mp-link">删除</span> 
              </div>
              <el-button :disabled="item.children.length >= 30" @click="addSubClassify(item)">添加二级分类</el-button>
            <!-- </div> -->
            </draggable>
          </el-collapse-item>
        </draggable>
      </el-collapse>
      <el-button style="margin-top:10px;" @click="addClassify" :disabled="classifyList.length >= 20" type="primary">添加一级分类</el-button>
      <span class="img-tips">最多可有20个一级分类</span>
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
      activeNames: [0, 1, 2],
      groupOptions: [],
      groupObj: {},
      editSupIndex: -1,
      editSubIndex: -1,
      classifyList: [

      ]
    }
  },
  watch: {
    classifyList: {
      handler(newVal) {
        this.setClassifyListB(newVal)
        this.submit()
      },
      // immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapState([
      'classifyListB'
    ])
  },
  components: {
    MpSelect
  },
  methods: {
    ...mapMutations([
      'changeSettingName', 'setClassifyListB'
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
      if (this.classifyList.length > 0) {
        return
      }
      let obj = {
        supName: '',
        children: [
          {
            name: '',
            imgUrl: '',
            groupId: ''
          }
        ]
      }
      for (let i = 0;i < 3;i++) {
        this.classifyList.push(JSON.parse(JSON.stringify(obj)))
      }
    },
    deleteSupClassify(item, index) {
      this.$confirm('确认要删除该一级分类吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        this.classifyList.splice(index, 1)
      }).catch(() => {

      })
    },
    deleteSubClassify(classify, idx, index) {
      this.$confirm('确认要删除该二级分类吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        this.classifyList[index].children.splice(idx, 1)
      }).catch(() => {

      })
    },
    addSubClassify(item) {
      item.children.push({
        name: '',
        imgUrl: '',
        groupId: ''
      })
    },
    addClassify() {
      if (this.classifyList.length >= 20) {
        this.$message.warning('最多可有20个一级分类')
        return
      }
      this.$nextTick(() => {
        setTimeout(() => {
          let classifyDom = document.querySelector('.classify-content')
          classifyDom.scrollTop = classifyDom.scrollHeight
        }, 100)
      })
      this.activeNames.push(this.classifyList.length)
      this.classifyList.push({
        supName: '',
        children: [
          {
            name: '',
            imgUrl: '',
            groupId: ''
          }
        ]
      })
    },
    changeEditIndex(index, idx) {
      this.editSupIndex = index
      this.editSubIndex = idx
    },
    handleAvatarSuccess(res, file) {
      this.classifyList[this.editSupIndex].children[this.editSubIndex].imgUrl = res.Url
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
    this.classifyList = this.classifyListB
    if (this.classifyList.length > 0) {
      this.activeNames = []
      for (let i = 0;i < this.classifyList.length;i++) {
        this.activeNames.push(i)
      }
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
    margin-bottom: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    @include scrollBar;
    .el-collapse{
      .el-input{
        display: inline-block;
        width: 160px;
        z-index: 0;
      }
      .mp-link{
        padding: 0 5px;
        margin-right: 50px;
      }
      .children-classify{
        .last-select{
          .mp-select-wrapper{
            height: 240px;
            position: relative;
            color: #606266;
            z-index: 100;
            width: 106%;
            left: -4px;
            top: -44px;
          }
        }
        .classify-item{
          margin: 10px;
          .mp-select-wrapper{
            height: 220px !important;
          }
        }
        .mp-select{
          vertical-align: top;
          margin-top: 10px;
          .select-val {
            z-index: 0;
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
          position: absolute;
          color: #606266;
          z-index: 100;
          width: 106%;
          left: -4px;
          top: 0;
        }
        .mp-select-content{
          max-height: 150px;
          overflow-y: auto;
        }
        .select-val{
          top: 8px;
        }
        .avatar-uploader{
          width: 56px;
          height: 56px;
          line-height: 56px;
          margin-right: 80px;
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
            vertical-align: top;
          }
        }
      }
    }
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
