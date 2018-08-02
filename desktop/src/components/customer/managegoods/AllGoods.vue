<template>
  <div>
    <div v-show="!isChildRouter">
      <div class="common-header search-header">
        <p class="search-title">全部商品</p>
        <div style="margin-bottom: 16px;">
          <el-select v-model="shelfStateValue" placeholder="上架状态" @change="changeShelfState">
            <el-option
              v-for="item in shelfStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <mp-select v-model="groupId" :options="groupOptions" @change="changeGroup" :props="optionsProps" filterable></mp-select>
          <el-input
            class="mp-input"
            placeholder="搜索商品名称/编码"
            @keyup.native.enter="getSummarys"
            v-model="queryStr">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div>
          <el-button type="primary" @click="addGoods">添加商品</el-button>
          <el-button @click="batchUp">批量上架</el-button>
          <el-button @click="batchDown">批量下架</el-button>
          <el-button @click="batchGroup">批量分组</el-button>
          <el-dropdown @command="handleCommand" trigger="click" placement="bottom" class="mp-dropdown">
            <el-button>
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="deleteGoods">删除商品</el-dropdown-item>
              <el-dropdown-item command="modifyModule">修改运费模版</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="goods-wrapper">
        <table class="goods-table">
          <thead>
            <tr>
              <td width="18%">
                <el-checkbox v-model="allChecked" :indeterminate="isIndeterminate"></el-checkbox>商品名称
              </td>
              <td width="16%">
                价格
                <!-- <mp-sort @changeSort="sortPrice"></mp-sort> -->
              </td>
              <td width="16%">
                库存
                <!-- <mp-sort @changeSort="sortStock"></mp-sort> -->
              </td>
              <td>上架状态</td>
              <td width="16%">
                <mp-sort @changeSort="sortFn" :descend="true" :hasDefault="false">排序</mp-sort>
              </td>
              <td width="14%">操作</td>
            </tr>
          </thead>
          <tbody v-if="goodsList.length > 0">
            <tr v-for="(item, index) in goodsList" :key="item.price" :class="{'bg-tr': index % 2 != 0}">
              <td  width="18%">
                <span class="goods-title">
                 <el-checkbox v-model="item.checked"></el-checkbox> {{item.title}}
                </span>
              </td>
              <td>
                {{ item.minSkuPrice == item.maxSkuPrice ? item.minSkuPrice: `${item.minSkuPrice} - ${item.maxSkuPrice}` }}
              </td>
              <td>
                {{item.stockTotalCount}}
              </td>
              <td>
                {{item.status == 1 ? '上架中': '已下架'}}
              </td>
              <td>
                {{item.order}} 
                <el-popover trigger="click"  placement="bottom" @hide="cancelPop(item)" popper-class="custom-popover" v-model="item.visible">
                  <p class="edit-text">排序</p>
                  <el-input-number class="edit-input" :min="0" :max="999999999" :controls="false" :step="1" v-model="item.order" placeholder="输入排序数字"></el-input-number>
                  <p class="tips">数字越大，排序越靠前</p>
                  <div style="text-align:center;">
                    <el-button size="small" round @click="cancelPop(item)">取消</el-button>
                    <el-button size="small" type="primary" round @click="saveSort(item)">保存</el-button>
                  </div>
                  <div slot="reference" class="sort-wrapper">
                    <span class="el-icon-edit" @click="setOriginOrder(item)"></span>
                  </div>
                </el-popover>
              </td>
              <td>
                <span class="mp-link" @click="editGoods(item)">编辑</span><span class="mp-link" @click="copyGoods(item)">复制</span>
                <el-popover trigger="click"  placement="bottom" @hide="cancelLink(item)" popper-class="custom-popover">
                  <p class="link-text">{{item.qrVisible ? '小程序码': '链接'}}</p>
                  <img v-if="item.qrVisible" :src="item.src" alt="">
                  <p>
                    <a v-if="item.qrVisible" class="downlaod-btn" download="wxacode.png" title="Download QR code" :href="item.src" target="_blank">下载</a>
                  </p>
                  <p v-if="item.linkVisible">
                    <input type="text" class="special-input" :class="item.className" v-model="linkUrl">
                  </p>
                  <div v-if="!item.linkVisible && !item.qrVisible" style="text-align:center;">
                    <el-button size="small" type="primary" round @click="getLink(item)">链接地址</el-button>
                    <el-button size="small" type="primary" round @click="getQrCode(item)">小程序码</el-button>
                  </div>
                  <div v-if="item.linkVisible" style="text-align:center;">
                    <el-button size="small" round @click="copyText(item)">复制</el-button>
                  </div>
                  <div slot="reference" class="sort-wrapper">
                    <span class="mp-link">链接</span>
                  </div>
                </el-popover>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6" class="no-data">暂无商品</td>
            </tr>
          </tbody>
        </table>
        <el-dialog
          title="批量分组"
          :visible.sync="groupDialogVisible"
          top="32vh"
          width="466px"
          center>
          <div class="select-group">
            <mp-select v-model="editGroupId" :options="groupOptions" :props="optionsProps" filterable placeholder="选择分组"></mp-select>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="mp-large-btn" @click="comfirmBatchGroup">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="修改运费模板"
          :visible.sync="moduleDialogVisible"
          top="32vh"
          width="466px"
          center>
          <div class="select-group">
            <el-select v-model="freightModuleValue" placeholder="选择运费模板">
              <el-option
                v-for="item in freightModuleOptions"
                :key="item.templateId"
                :label="item.name"
                :value="item.templateId">
              </el-option>
            </el-select>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" class="mp-large-btn" @click="confirmBatchTemplate">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="确认上架?"
          :visible.sync="upDialogVisible"
          class="confirm-dialog"
          width="390px"
          top="32vh"
          center>
          <span slot="footer" class="dialog-footer">
            <el-button class="mp-small-btn" @click="upDialogVisible = false">取 消</el-button>
            <el-button type="primary" class="mp-small-btn" @click="confirmBatchStatus(true)">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="确认下架?"
          :visible.sync="downDialogVisible"
          class="confirm-dialog"
          width="390px"
          top="32vh"
          center>
          <span slot="footer" class="dialog-footer">
            <el-button class="mp-small-btn" @click="downDialogVisible = false">取 消</el-button>
            <el-button type="primary" class="mp-small-btn"  @click="confirmBatchStatus(false)">确 定</el-button>
          </span>
        </el-dialog>
        <div class="page-container" v-if="goodsObj.totalPageCount > 1">
          <el-pagination
            layout="prev, pager, next"
            @current-change="getGoods"
            :current-page="goodsObj.currentPageIndex"
            :page-count="goodsObj.totalPageCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
/* eslint-disable */
import MpSelect from 'components/public/MpSelect'
import MpSort from 'components/public/MpSort'
import { trim, formatGroup } from 'assets/js/utils'
import { groupList } from 'assets/json/groupList'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    MpSelect,
    MpSort
  },
  data() {
    return {
      isChildRouter: false,
      optionsProps: {
        label: 'name',
        value: 'groupId'
      },
      groupDialogVisible: false,
      moduleDialogVisible: false,
      upDialogVisible: false,
      downDialogVisible: false,
      goodsObj: {},
      order: 'OrderDes',
      queryStr: '',
      pageIndex: 1,
      shelfStateValue: '',
      shelfStateOptions: [
        {
          label: '上架中',
          value: 'Onsell'
        },
        {
          label: '已下架',
          value: 'Offsell'
        }
      ],
      freightModuleValue: '',
      freightModuleOptions: [],
      groupList,
      groupOptions: [],
      groupId: '',
      appId: '',
      editGroupId: '',
      isIndeterminate: false,
      goodsList: [],
      linkUrl: ''
    }
  },
  methods: {
    confirmBatchStatus(flag) {
      let status
      if (flag) {
        status = "Onsell"
        this.upDialogVisible = false
      } else {
        status = "Offsell"
        this.downDialogVisible = false
      }
      this.$http.put('/api/product/bulk/status', {
        productIds: this.productIds,
        status
      }).then((res) => {
        this.getSummarys()
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.confirmBatchStatus(flag)
        })
      })
    },
    comfirmBatchGroup() {
      if (this.editGroupId == -1) {
        this.$http.put('/api/product/bulk/group', {
          productIds: this.productIds,
          groupId: null
        }).then((res) => {
          this.getSummarys()
        }).catch((err) => {
          this.loginAgain(err).then(() => {
            this.comfirmBatchGroup()
          })
        })
      } else {
        this.$http.put('/api/product/bulk/group', {
          productIds: this.productIds,
          groupId: this.editGroupId
        }).then((res) => {
          this.getSummarys()
        }).catch((err) => {
          this.loginAgain(err).then(() => {
            this.comfirmBatchGroup()
          })
        })
      }
      this.groupDialogVisible = false
    },
    confirmBatchTemplate() {
      this.$http.put('/api/product/bulk/freight/template', {
        productIds: this.productIds,
        templateId: this.freightModuleValue
      }).then((res) => {
        this.getSummarys()
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.confirmBatchTemplate()
        })
      })
      this.moduleDialogVisible = false
    },
    getSummarys(flag) {
      let GroupId
      if (flag) {
        GroupId = null
      } else {
        GroupId = this.groupId
      }
      this.$http.get('/api/product/summarys', {
        params: {
          GroupId,
          Title: this.queryStr,
          Order: this.order,
          StoreId: localStorage.getItem('storeId'),
          pageIndex: this.pageIndex,
          pageSize: 10,
          Status: this.shelfStateValue
        }
      }).then((res) => {
        this.goodsObj = res.data.data
        this.goodsList = this.goodsObj.currentPageDatas
        this.goodsList.forEach((item, index) => {
          this.$set(item, 'checked', false)
          this.$set(item, 'className', 'input' + index)
          this.$set(item, 'linkVisible', false)
          this.$set(item, 'qrVisible', false)
        })
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getSummarys(flag)
        })
      })
    },
    getFreight() {
      if (this.freightModuleOptions.length == 0) {
        this.$http.get('/api/product/freight/template/summarys', {
          params: {
            storeId: localStorage.getItem('storeId')
          }
        }).then((res) => {
          this.freightModuleOptions = res.data.data.currentPageDatas
        }).catch((err) => {
          this.loginAgain(err).then(() => {
            this.getFreight()
          })
        })
      }
    },
    addGoods() {
      this.isChildRouter = true
      this.$router.push({
        path: '/allgoods/addgoods'
      })
      // window.location.reload()
    },
    editGoods(item) {
      this.isChildRouter = true
      this.$router.push({
        path: '/allgoods/modifygoods',
        query: {
          id: item.productId
        }
      })
      // window.location.reload()
    },
    copyGoods(item) {
      this.$http.get("/api/product", {
        params: {
          id : item.productId
        }
      }).then((res) => {
        let copyData = res.data.data
        delete copyData.productId
        this.$http.post('/api/product', copyData).then((res) => {
          this.getSummarys()
          this.$message.success('复制成功')
        })
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.copyGoods(item)
        })
      })
    },
    copyText(item) {
      let input = document.querySelector(`.${item.className}`)
      input.select()
      document.execCommand("Copy")
    },
    batchUp() {
      if (this.checkedGoods.length == 0) {
        this.$message.warning('请选择至少一个商品')
        return
      }
      this.upDialogVisible = true
    },
    batchDown() {
      if (this.checkedGoods.length == 0) {
        this.$message.warning('请选择至少一个商品')
        return
      }
      this.downDialogVisible = true
    },
    batchGroup() {
      if (this.checkedGoods.length == 0) {
        this.$message.warning('请选择至少一个商品')
        return
      }
      this.groupDialogVisible = true
    },
    changeShelfState(val) {
      this.getSummarys()
    },
    changeGroup(val) {
      if (val == -1) {
        this.getSummarys(true)
      } else {
        this.groupId = val
        this.getSummarys()
      }
    },
    getGoods(index) {
      this.pageIndex = index
      this.getSummarys()
    },
    sortFn(str) {
      if (this.order == 'OrderAes') {
        this.order = 'OrderDes'
      } else {
        this.order = 'OrderAes'
      }
      this.getSummarys()
    },
    sortStock(str) {
    },
    sortPrice(str) {
    },
    getLink(item) {
      item.linkVisible = true
      this.linkUrl = `www.youdianvip.com/customer/preview.html#/detail?productid=${item.productId}`
    },
    cancelLink(item) {
      item.linkVisible = false
      item.qrVisible = false
    },
    getQrCode(item) {
      item.qrVisible = true
      if (!this.appId) {
        this.$http.get('/api/wechat/miniapp', {
          params: {
            storeId: localStorage.getItem('storeId')
          }
        }).then((res) => {
          this.appId = res.data.data.appId
          this.$set(item, 'src', `//api.youdianvip.com/api/wechat/wxacode?AppId=${this.appId}&Scene=productId=${item.productId}`)
        }).catch((err) => {
          this.loginAgain(err).then(() => {
            this.getQrCode(item)
          })
        })
      } else {
        this.$set(item, 'src', `//api.youdianvip.com/api/wechat/wxacode?AppId=${this.appId}&Scene=productId=${item.productId}`)
      }
    },
    setOriginOrder(item) {
      this.$set(item, 'originOrder', item.order)
    },
    cancelPop(item) {
      item.visible = false
      if (item.originOrder) {
        item.order = item.originOrder
      }
    },
    saveSort(item) {
      this.$http.get("/api/product",{
        params: {
          id: item.productId
        }
      }).then((res) => {
        let data = res.data.data
        data.order = item.order
        data.updateSkus = data.skus
        this.$http.put('/api/product', data).then((res) => {
          item.originOrder = item.order
          item.visible = false
          this.getSummarys()
        }).catch((err) => {
          this.loginAgain(err).then(() => {
            this.saveSort(item)
          })
        })
      })
    },
    getGroupObj() {
      return this.$http.get('/api/product/group/summarys', {params: {
        storeId: localStorage.getItem('storeId')
      }}).then((res) => {
        this.groupObj = res.data.data
        this.groupOptions = formatGroup(this.groupObj.currentPageDatas)
        this.groupOptions.unshift({
          name: '未分组',
          groupId: -1
        })
        return Promise.resolve(this.groupObj.currentPageDatas)
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getGroupObj()
        })
      })
    },
    handleCommand(command) {
      if (command == 'deleteGoods') {
        if (this.checkedGoods.length == 0) {
          this.$message.warning('请选择至少一个商品')
          return
        }
        this.$confirm('商品删除后不可恢复，是否继续？', '删除商品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          let params = []
          this.productIds.forEach((item) => {
              params.push(`productIds=${item}`)
            }
          )
          this.$http.delete('/api/product?' + params.join('&'), {
            // params: {
            //   ProductIds: this.productIds
            // }
          }).then((res) => {
            this.getSummarys()
          }).catch((err) => {
            this.loginAgain(err).then(() => {
              this.handleCommand(command)
            })
          })
        }).catch(() => {
          
        })
      } else if (command == 'modifyModule') {
        this.getFreight()
        if (this.checkedGoods.length == 0) {
          this.$message.warning('请选择至少一个商品')
          return
        }
        this.moduleDialogVisible = true
      }
    }
  },
  mounted () {
    // this.goodsList.forEach((item, index) => {
    //   this.$set(item, 'checked', false)
    //   this.$set(item, 'className', 'input' + index)
    //   this.$set(item, 'linkVisible', false)
    // })
    this.getGroupObj()
    let groupId = this.$router.currentRoute.query.groupId
    if (this.$router.currentRoute.query.groupId) {
      this.groupId = groupId
    }
    if (this.$router.currentRoute.name !== 'allgoods') {
      this.isChildRouter = true
    } else {
      this.getSummarys()
    }
  },
  watch: {
    '$route'(newRouter) {
      if (newRouter.name == 'allgoods') {
        this.isChildRouter = false
        this.getSummarys()
      }
    }
  },
  computed: {
    productIds() {
      return this.checkedGoods.map((item) => {
        return item.productId
      })
    },
    checkedGoods() {
      return this.goodsList.filter((item) => {
        return item.checked
      })
    },
    allChecked: {
      get() {
        this.isIndeterminate = false
        let arr = this.goodsList.filter((item) => {
          return item.checked
        })
        if (arr.length == this.goodsList.length) {
          return true
        }
        if (arr.length > 0 && arr.length < this.goodsList.length) {
          this.isIndeterminate = true
        }
        return false
      },
      set(val) {
        if (val) {
          this.goodsList.forEach((item) => {
            item.checked = true
          })
        } else {
          this.goodsList.forEach((item) => {
            item.checked = false
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/css/customer/common.scss';
.confirm-dialog {
  .el-dialog__footer {
    padding: 2px 0 32px 0;
  }
}
.delete-goods {
  .el-dialog__footer {
    padding: 20px 0 30px 0;
  }
  .confirm-text {
    text-align: center;
    .el-icon-warning {
      color: #ffbb33;
      font-size: 18px;
      margin-right: 5px;
    }
  }
}
.el-dialog {
  .mp-select {
    .select-val {
      top: 10px !important;
    }
  }
}


.search-header {
  width: 100%;
  padding: 30px 20px;
  margin-bottom: 24px;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .mp-select {
    width: 200px !important;
    .select-val {
      top: 11px !important;
    }
  }
  .el-dropdown {
    top: 0 !important;
  }
  .el-button {
    padding: 10px 20px !important;
    margin-left: 14px;
  }
  .el-button--primary {
    margin-left: 0;
  }
  .el-popper {
    margin-top: 12px !important;
  }
  .el-select {
    width: 200px;
    margin-right: 14px;
  }
  .mp-input {
    display: inline-block;
    width: 226px;
  }
  .search-title {
    font-size: 20px;
    margin-bottom: 16px;
  }
}
.goods-wrapper {
  width: 100%;
  padding: 30px 20px 50px 20px;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .goods-table {
    width: 100%;
    font-size: 14px;
    margin-bottom: 40px;
    .el-checkbox {
      margin: 0 8px 0 24px;
    }
    thead {
      color: #7d8087;
      font-weight: bold;
      border-bottom: 1px solid #ebeef5;
    }
    .no-data {
      text-align: center;
      line-height: 60px;
      color: #909399;
    }
    tbody {
      .goods-title{
        display: block;
        width: 200px;
        height: 48px;
        line-height: 48px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      tr {
        line-height: 47px;
        border-bottom: 1px solid #ebeef5;
      }
      td{
        white-space: nowrap;
      }
      .sort-wrapper {
        display: inline-block;
        &:focus {
          border: none;
          outline: none;
        }
      }
      .bg-tr {
        background: #fafafa;
      }
      .mp-link {
        margin-right: 16px;
      }
      .el-icon-edit {
        color: #519ae9;
        cursor: pointer;
      }
    }
  }
}
.custom-popover {
  text-align: center;
  padding: 22px 28px;
  margin-top: 0 !important;
  .edit-input{
    .el-input{
      width: 100%;
      .el-input__inner{
        text-align: left;
      }
    }
  }
  .downlaod-btn {
    display: inline-block;
    border: 1px solid #dcdfe6;
    color: #606266;
    font-size: 12px;
    border-radius: 20px;
    padding: 5px 11px;
  }
  img {
    width: 130px;
    margin-bottom: 10px;
  }
  .el-input {
    margin: 8px 0;
    width: 260px;
  }
  .link-text {
    margin-bottom: 24px;
  }
  .tips {
    text-align: left;
    font-size: 12px;
    color: #8b8e95;
    margin-bottom: 16px;
  }
}
.special-input {
  border: none;
  outline: none;
}
.page-container {
  text-align: center;
}
.select-group {
  text-align: center;
  .mp-select {
    width: 336px;
    text-align: left;
  }
  .el-input {
    width: 336px;
  }
}
</style>
