<template>
  <div>
    <div class="manage-template-container" v-show="!isChildRouter">
      <div class="manage-template-header">
        <p>模板管理</p>
        <el-button type="primary" @click="createTemplate">新建运费模板</el-button>
      </div>
      <div class="manage-template-content" v-loading="loading">
        <el-collapse  v-model="activeNames" v-if="freightList.length">
          <el-collapse-item v-for="(item, index) in freightList" :key="item.name" :name="index">
            <template slot="title">
              <div @click="getFreightDetail(item)">
                <span class="group-name">{{item.name}} </span>
                <span class="fr mp-link" @click.stop.prevent="deleteFreight(item, index)">删除</span>
                <span class="fr mp-link" @click.stop.prevent="editFreight(item)">编辑</span> 
                <span class="fr mp-link" @click.stop.prevent="copyFreight(item, index)">复制</span>
                <span class="fr edit-time">最后编辑时间  {{item.lastModifiedTime | formatDate}}</span>
              </div>
            </template>
            <div v-if="item.children" class="children-group">
              <div>
                <el-table
                  :data="formatFreight(item.children)"
                  style="width: 100%">
                  <el-table-column
                    prop="areaText"
                    label="可配送区域"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="firstValue"
                    :label="firstText(item)"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="firstPrice"
                    label="运费(元)">
                  </el-table-column>
                  <el-table-column
                    prop="continueValue"
                    :label="continueText(item)">
                  </el-table-column>
                  <el-table-column
                    prop="continuePrice"
                    label="续费(元)">
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="page-container" v-if="freightObj.totalPageCount > 1">
          <el-pagination
            layout="prev, pager, next"
            @current-change="getFreight"
            :current-page="freightObj.currentPageIndex"
            :page-count="freightObj.totalPageCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapMutations } from 'vuex'
import { formatArea, formatDate } from 'src/filters/filters'
export default {
  data() {
    return {
      activeNames: [],
      isChildRouter: false,
      loading: true,
      unitType: '',
      freightObj: {},
      freightList: [
        {
          "templateId": 0,
          "name": "运费模板",
          "lastModifiedTime": "2018-05-30T11:16:40.044Z",
          "createTime": "2018-05-30T11:16:40.044Z",
          "storeId": 0
        }
      ]
    }
  },
  methods: {
    ...mapMutations([
      'setIsChange'
    ]),
    editFreight(item) {
      this.isChildRouter = true
      this.setIsChange(false)
      this.$router.push({
        path: '/managetemplate/modifytemplate',
        query: {
          templateId: item.templateId
        }
      })
    },
    copyFreight(item) {
      this.getFreightDetail(item).then((res) => {
        let copyItem = JSON.parse(JSON.stringify(res))
        copyItem.name = res.name + Date.now()
        copyItem.algorithms = res.children
        copyItem.algorithms.forEach((itm) => {
          itm.schemes.forEach((it) => {
            it.areaCode = it.area
            it.provinceCode = it.province
            it.cityCode = it.city
          })
        })
        copyItem.unitType = res.unitType
        copyItem.type = res.type
        copyItem.isDefault = res.isDefault
        delete copyItem.children
        delete copyItem.templateId
        this.$http.post('/api/product/freight/template', copyItem).then((res) => {
          this.getFreight(1)
          this.$message.success('复制成功')
        }).catch((err) => {
          this.loginAgain(err).then(() => {
            this.copyFreight(item)
          })
        })
      })
    },
    deleteFreight(item, index) {
       this.$confirm('删除后不可恢复, 是否继续？', '删除运费模版', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then((res) => {
        this.$http.delete('/api/product/freight/template', {
          params: {
            templateId: item.templateId
          }
        }).then((res) => {
          this.freightList.splice(index, 1)
        }).catch((err) => {
          let errCode = err.response.data.error.code
          if (errCode == 30012) {
            this.$alert("分组正在使用中，无法删除。若要继续删除，请将商品指定新的分组" , "删除失败", {
              confirmButtonText: '确定',
              center: true
            })
            return
          }
          this.loginAgain(err).then(() => {
            this.deleteFreight(item, index)
          })
        })
      }).catch(() => {
        
      })
    },
    createTemplate() {
      this.isChildRouter = true
      this.setIsChange(false)
      this.$router.push({
        path: '/managetemplate/createtemplate'
      })
    },
    firstText(item) {
      switch (item.unitType) {
        case 1:
          return '首件(个)'
          break;
        case 2:
          return '首重(kg)'
          break;
        case 3:
          return '首体积(m³)'
          break;
      }
    },
    continueText(item) {
      switch (item.unitType) {
        case 1:
          return '续件(个)'
          break;
        case 2:
          return '续重(kg)'
          break;
        case 3:
          return '续体积(m³)'
          break;
      }
    },
    formatFreight(list) {
      list.forEach((item) => {
        item.regions = []
        item.schemes.forEach((itm) => {
          if (itm.area) {
            item.regions.push(itm.area)
          } else if (itm.city){
            item.regions.push(itm.city)
          } else if(itm.province) {
            item.regions.push(itm.province)
          }
        })
        item.areaText = formatArea(item.regions) == ' ' ? '全国' :formatArea(item.regions)
      })
      return list
    },
    getFreightDetail(item) {
      if (!item.children) {
        return this.$http.get(`/api/product/freight/template/${item.templateId}`).then((res) => {
            this.$set(item, 'children', res.data.data.algorithms)
            this.$set(item, 'unitType', res.data.data.unitType)
            this.$set(item, 'type', res.data.data.type)
            this.$set(item, 'isDefault', res.data.data.isDefault)
            return Promise.resolve(item)
        }).catch((err) => {
          this.loginAgain(err).then(() => {
            this.getFreightDetail(item)
          })
        })
      } else {
        return Promise.resolve(item)
      }
    },
    getFreight(pageIndex) {
      this.loading = true
      this.$http.get('/api/product/freight/template/summarys',{
        params: {
          pageIndex,
          pageSize: 5,
          storeId: localStorage.getItem('storeId')
        }
      }).then((res) => {
        this.loading = false
        this.freightObj = res.data.data
        this.freightList = res.data.data.currentPageDatas
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getFreight(pageIndex)
        })
      })
    }
  },
  computed: {
    ...mapState([
      'isChange'
    ])
  },
  filters: {
    formatDate
  },
  watch: {
    '$route'(newRouter) {
      if (newRouter.name == 'managetemplate') {
        this.isChildRouter = false
        this.getFreight(1)
        this.activeNames = []
      }
    },
    isChange(newVal) {
      console.log(newVal)
    }
  },
  mounted () {
    if (this.$router.currentRoute.name !== 'managetemplate') {
      this.isChildRouter = true
    } else {
      this.getFreight(1)
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
    .edit-time{
      color: #909399;
      margin-right: 22px;
    }
    .page-container{
      width: 100%;
      margin-top: 20px;
      text-align: center;
    }
  }
}
</style>
