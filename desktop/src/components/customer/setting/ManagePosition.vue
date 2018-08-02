<template>
  <div>
    <div class="manage-template-container" v-show="!isChildRouter">
      <div class="manage-template-header">
        <p>职位管理</p>
        <el-button type="primary" @click="createPosition">添加职位</el-button>
      </div>
      <div class="manage-template-content" v-loading="loading">
        <el-table
          v-if="permissionsObj.currentPageDatas"
          :data="permissionsList"
          style="width: 100%">
          <el-table-column
            label="职位"
            prop="displayName">
          </el-table-column>
          <el-table-column
            label="描述"
            prop="description">
          </el-table-column>
          <el-table-column
            label="账号数量"
            prop="userCount">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                type="text"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-container" v-if="permissionsObj.totalPageCount > 1">
          <el-pagination
            layout="prev, pager, next"
            @current-change="getPermissions"
            :current-page="permissionsObj.currentPageIndex"
            :page-count="permissionsObj.totalPageCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      activeNames: [],
      isChildRouter: false,
      loading: true,
      unitType: '',
      permissionsObj: {},
      permissionsList: []
    }
  },
  methods: {
    handleEdit(index, item) {
      this.isChildRouter = true
      this.$router.push({
        path: '/manageposition/modifyposition',
        query: {
          permissionid: item.permissionId
        }
      })
    },
    handleDelete(index, item) {
      if (item.userCount > 0) {
        this.$alert('职位正在使用中，无法删除。若要继续删除，请将子账号指定新的职位。', '删除失败', {
          confirmButtonText: '好的',
          center: true,
          callback: action => {
            
          }
        })
        return
      }
      this.$confirm('确定删除该职位?', '删除职位', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$http.delete(`/api/user/permissions/${item.permissionId}`).then((res) => {
          this.$message.success('删除成功')
          this.getPermissions(1)
        }).catch((err) => {

          this.loginAgain(err).then(() => {
            this.getPermissions(1)
          })
        })
      }).catch(() => {
        
      })
    },
    createPosition() {
      this.isChildRouter = true
      this.$router.push({
        path: '/manageposition/createposition'
      })
    },
    getPermissions(pageIndex) {
      this.loading = true
      this.$http.get('/api/user/permissions/summarys', {
        params: {
          pageIndex,
          pageSize: 10
        }
      }).then((res) => {
        this.loading = false
        this.permissionsObj = res.data.data
        this.permissionsList = res.data.data.currentPageDatas
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getPermissions(1)
        })
      })
    }
  },
  computed: {
    
  },
  filters: {
  },
  watch: {
    '$route'(newRouter) {
      if (newRouter.name == 'manageposition') {
        this.isChildRouter = false
        this.getPermissions(1)
        this.activeNames = []
      }
    },
    isChange(newVal) {
    }
  },
  mounted () {
    if (this.$router.currentRoute.name !== 'manageposition') {
      this.isChildRouter = true
    } else {
      this.getPermissions(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.manage-template-container{
  width: 100%;
  .manage-template-header{
    padding: 30px 24px;
    margin-bottom: 20px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    p{
      font-size: 20px;
      color: #303133;
      margin-bottom: 30px;
    }
  }
  .manage-template-content{
    padding: 40px 24px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    .fr{
      margin-right: 10px;
    }
    .page-container{
      width: 100%;
      text-align: center;
      margin: 20px;
    }
    .edit-time{
      color: #909399;
      margin-right: 20px;
    }
  }
}
</style>
