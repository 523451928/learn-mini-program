<template>
  <div>
    <div class="group-header">
      <p class="group-title">添加分组</p>
      <div style="margin-bottom: 16px;">
        <span>
          分组名称 &nbsp; <el-input maxlength="10" v-model="name" placeholder="10字以内"></el-input>
        </span>
        <span>
          上级分组 &nbsp;
          <el-select v-model="parentGroupId" placeholder="请选择">
            <el-option
              v-for="item in groupOptions"
              :key="item.name"
              :label="item.name"
              :value="item.groupId">
            </el-option>
          </el-select>
        </span>
      </div>
      <div>
        <el-button type="primary" @click="addGroup" class="mp-small-btn">添加分组</el-button>
      </div>
    </div>
    <div class="group-wrapper" v-loading.fullscreen.lock="loading">
      <el-collapse  v-model="activeNames" v-if="list.length">
        <el-collapse-item v-for="(item, index) in list" :key="item.name" :name="index" >
          <template slot="title">
           <span class="group-name">{{item.name}} </span>
           <span v-if="index != 0" class="hover-link mp-link" @click.stop.prevent="seeProduct(item)">查看商品</span>
           <span v-if="index != 0" class="fr mp-link" @click.stop.prevent="deleteGroup(item, index)">删除</span>
           <span  v-if="index != 0" class="fr mp-link" @click.stop.prevent="editGroup(item)">编辑</span> 
          </template>
          <div v-if="item.children" class="children-group">
            <div v-for="(group, idx) in item.children" :key="group.name">
              <span class="group-name">{{group.name}} </span>
              <span class="hover-link mp-link" @click.stop.prevent="seeProduct(group)">查看商品</span>
              <span style="margin-right: 6px;" @click="deleteSubGroup(group, idx, index)" v-if="index != 0" class="fr mp-link">删除</span> 
              <span @click="editSubGroup(group, item)" v-if="index != 0" class="fr mp-link">编辑</span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div style="text-align: center; color: #909399;" v-else>
        暂无分组
      </div>
    </div>
    <el-dialog
        title="编辑分组"
        :visible.sync="editDialogVisible"
        class="delete-goods"
        width="490px"
        center>
        <div class="edit-content">
          <div class="group-name">
            分组名称 <el-input maxlength="10" v-model="editName" placeholder="10字以内"></el-input>
          </div>
          <div v-if="!isRootGroup">
            上级分组 
            <el-select v-model="editParentGroupId" placeholder="请选择">
              <el-option
                v-for="item in esitGroupOptions"
                :key="item.name"
                :label="item.name"
                :value="item.groupId">
              </el-option>
            </el-select>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="mp-small-btn" @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" class="mp-small-btn" @click="modifyGroup">确 定</el-button>
        </span>
      </el-dialog>
      <div class="page-container" v-if="groupObj.totalPageCount > 1">
        <el-pagination
          layout="prev, pager, next"
          @current-change="getGroupObj"
          :current-page="groupObj.currentPageIndex"
          :page-count="groupObj.totalPageCount">
        </el-pagination>
      </div>
  </div>
</template>

<script>
/* eslint-disable */
import { trim, formatGroup } from 'assets/js/utils'
import { groupList } from 'assets/json/groupList'
export default {
  data() {
    return {
      name: '',
      editName: '',
      isRootGroup: true,
      loading: false,
      editParentGroupId: '',
      editGroupId: '',
      editDialogVisible: false,
      parentGroupId: '',
      groupObj: {},
      list: [],
      activeNames: [0],
      pageIndex: 1,
      groupList
    }
  },
  methods: {
    seeProduct(item) {
      console.log(item)
      this.$router.push({
        path: '/allgoods',
        query: { groupId: item.groupId }
      })
    },
    modifyGroup() {
      if (!trim(this.editName)) {
        this.$message.warning('请输入分组名')
        return
      }
      if (this.isRootGroup) {
        this.$http.put('/api/product/group', {
          groupId: this.editGroupId,
          name: this.editName
        }).then((res) => {
          this.getGroupObj()
        })
      } else {
        this.$http.put('/api/product/group/sub', {
          groupId: this.editGroupId,
          name: this.editName,
          parentId: this.editParentGroupId
        }).then((res) => {
          this.getGroupObj()
        })
      }
      this.editDialogVisible = false
    },
    editGroup(item) {
      this.editName = item.name
      this.editGroupId = item.groupId
      this.editDialogVisible = true
      this.isRootGroup = true
    },
    editSubGroup(group, item) {
      this.editDialogVisible = true
      this.isRootGroup = false
      this.editName = group.name
      this.editGroupId = group.groupId
      this.editParentGroupId = item.groupId
    },
    deleteGroup(item, index) {
      this.$confirm('分组删除后不可恢复, 是否继续？', '删除分组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then((res) => {
        this.$http.delete('/api/product/group', {
          params: {
            id: item.groupId
          }
        }).then((res) => {
          this.list.splice(index, 1)
        }).catch((err) => {
          if (err.response.data.error.code == 30007) {
            this.$alert('分组正在使用中，无法删除。若要继续删除，请将商品指定新的分组。', '删除失败', {
              confirmButtonText: '好的',
              center: true,
              callback: action => {
                
              }
            })
            return
          }
          this.loginAgain(err).then(() => {
            this.deleteGroup(item, index)
          })
        })
      }).catch(() => {
        
      })
    },
    deleteSubGroup(item, idx, index) {
      this.$confirm('分组删除后不可恢复, 是否继续？', '删除分组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$http.delete('/api/product/group', {
          params: {
            id: item.groupId
          }
        }).then((res) => {
          this.list[index].children.splice(idx, 1)
          this.list = [...this.list]
        }).catch((err) => {
          if (err.response.data.error.code == 30007) {
            this.$alert('分组正在使用中，无法删除。若要继续删除，请将商品指定新的分组。', '删除失败', {
              confirmButtonText: '好的',
              center: true,
              callback: action => {
                
              }
            })
            return
          }
          this.loginAgain(err).then(() => {
            this.deleteSubGroup(item, idx, index)
          })
        })
      }).catch(() => {

      })
    },
    addGroup() {
      if (!trim(this.name)) {
        this.$message.warning('请输入分组名')
        return
      }
      if (!this.parentGroupId) {
        this.$http.post('/api/product/group', {
          name: this.name,
          storeId: localStorage.getItem('storeId')
        }).then((res) => {
          this.getGroupObj()
        }).catch((err) => {
          if (err.response.data.error.code == 30011) {
            this.$message.warning('该分组名称已使用')
            return
          }
          this.loginAgain(err).then(() => {
            this.addGroup()
          })
        })
      } else {
        this.$http.post('/api/product/group/sub', {
          name: this.name,
          parentId: this.parentGroupId
        }).then((res) => {
          this.getGroupObj()
        }).catch((err) => {
          if (err.response.data.error.code == 30011) {
            this.$message.warning('该分组名称已使用')
            return
          }
          this.loginAgain(err).then(() => {
            this.addGroup()
          })
        })
      }
    },
    getGroupObj() {
      // this.loading = true
      return this.$http.get('/api/product/group/summarys', {params: {
        storeId: localStorage.getItem('storeId'),
        pageIndex: this.pageIndex
      }}).then((res) => {
        this.groupObj = res.data.data
        this.list = formatGroup(this.groupObj.currentPageDatas)
        this.list.unshift({
          name: '系统分组',
          children: [
            {
              name: '未分组',
              groupId: 0
            }
          ]
        })
        this.loading = false
        return Promise.resolve(this.groupObj.currentPageDatas)
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getGroupObj()
        })
      })
    }
  },
  computed: {
    groupOptions() {
      if (this.groupObj.currentPageDatas) {
        let options = this.groupObj.currentPageDatas.filter((item) => {
          return item.isRoot
        })
        options.unshift({
          name: '无',
          groupId: null
        })
        return options
      }
    },
    esitGroupOptions() {
      if (this.groupObj.currentPageDatas) {
        let options = this.groupObj.currentPageDatas.filter((item) => {
          return item.isRoot
        })
        return options
      }
    }
  },
  mounted () {
    this.getGroupObj()
  } 
}
</script>

<style lang="scss" scoped>
.edit-content{
  text-align: center;
  .group-name{
    .el-input{
      width: 334px;
      margin: 0 0 22px 10px;
    }
  }
  .el-select{
    width: 334px;
    margin-left: 10px;
  }
}
.group-header{
  width: 100%;
  padding: 30px 20px;
  margin-bottom: 24px;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  span{
    font-size: 14px;
    display: inline-block;
    margin-right: 30px;
  }
  .group-title{
    font-size: 20px;
    margin-bottom: 17px;
  }
  .el-input{
    width: 216px;
  }
}
.group-wrapper{
  width: 100%;
  padding: 30px 20px 50px 20px;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .group-name{
    display: inline-block;
    width: 310px;
  }
  .mp-link{
    margin-right: 16px;
  }
  .hover-link{
    display: none;
  }
  .see-product{
    margin-left: 250px;
  }
  .children-group{
    line-height: 38px;
    padding-left: 38px;
    color: #909399;
    div:hover{
      .hover-link{
        display: inline-block;
      }
    }
  }
  .el-collapse-item__header{
    &:hover{
      .hover-link{
        display: inline-block;
      }
    }
  }
}
</style>
