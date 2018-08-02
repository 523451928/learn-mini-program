<template>
  <div v-loading="loading">
    <el-row>
      <span>子账号管理</span>
      <el-button class="fr" type="primary" v-if="tableData.length < 20" size="small" @click="showDialog">开通子账号</el-button>
      <el-tooltip v-else class="item" effect="dark" content="最多能开通20个子账号" placement="top">
        <el-button class="fr" type="primary" style="background:#a0cfff;border-color:#a0cfff;" size="small">开通子账号</el-button>
      </el-tooltip>
      <el-dialog title="开通子账号" :visible.sync="dialogFormVisible" width="26%" center class="open-account">
        <div v-if="!isSendEmail">
          <el-form :model="form" :rules="rules" ref="ruleForm" status-icon class="demo-ruleForm">
            <el-form-item label="子账号" prop="email" label-position="left" label-width="60px">
              <el-input style="width:97%" type="text" v-model="form.email" auto-complete="off" placeholder="邮箱地址" onkeydown="if(event.keyCode==13){return false;}" ></el-input>
            </el-form-item>
            <el-form-item label="职位" prop="permissionId" label-position="left" label-width="60px">
              <el-select v-model="form.permissionId" placeholder="请选择">
                <el-option
                  v-for="item in positonOptions"
                  :key="item.permissionId"
                  :label="item.displayName"
                  :value="item.permissionId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="email-tips" v-else>
          <p>
            <span class="el-icon-success"></span>
          </p>
          <p>已向{{form.email}}发送邀请邮件，请联系对方在邮件内点击链接设置密码，完成创建</p>
        </div>
        <div v-if="!isSendEmail" slot="footer" class="dialog-footer">
          <el-button type="primary" @click="invitationFn">邀请开通</el-button>
        </div>
      </el-dialog>
    </el-row>
    <el-row>
       <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        :default-sort = "{prop: 'craeteTime', order: 'descending'}"
        >
        <el-table-column
          prop="account"
          label="子账号">
        </el-table-column>
        <el-table-column
          prop="position"
          label="职位">
        </el-table-column>
        <el-table-column
          prop="craeteTime"
          :formatter="formatterDate"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          :filters="[{ text: '使用中', value: 'Ok' }, { text: '待激活', value: 'WaitForActive' }]"
          :filter-method="filterStatus"
          :formatter="formatterStatus">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
           <template slot-scope="scope">
            {{scope.row.remark}}
            <el-popover trigger="click" placement="bottom" class="mp-popover" @hide="cancelPop(scope.row)" popper-class="mpmall-popover" v-model="scope.row.visible">
              <p class="edit-text">编辑备注</p>
              <el-input class="edit-input" v-model="scope.row.remark"></el-input>
              <div style="text-align:center;">
                <el-button size="small" round @click="cancelPop(scope.row)">取消</el-button>
                <el-button size="small" type="primary" round @click="saveSubuser(scope.row)">保存</el-button>
              </div>
              <div slot="reference" class="name-wrapper">
                <span class="el-icon-edit"  v-if="scope.row.status != 1"></span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-popover trigger="click" placement="bottom" class="mp-popover"  popper-class="mpedit-popover" @show="scope.row.isSuccess = false" v-model="scope.row.visible2">
              <p v-show="!scope.row.isSuccess"  class="edit-text">编辑备注</p>
              <div v-show="!scope.row.isSuccess" style="text-align:center;">
                <el-button size="small" type="primary" round @click="deleteAccount(scope.row, scope.column)">删除</el-button>
                <el-button size="small" type="primary" round @click="changePosition(scope.row, scope.column, scope.cellValue)">职位变更</el-button>
                <el-button size="small" type="primary" round v-if="scope.row.status != 1"  @click="resetPwd(scope.row, scope.column)">重置密码</el-button>
                <el-button size="small" type="primary" round v-if="inviteShow(scope.row)"  @click="inviteAgain(scope.row, scope.column)">重新邀请</el-button>
              </div>
              <div v-show="scope.row.isSuccess" class="invite-success">
                <span class="el-icon-success"></span>
                <p v-if="scope.row.isPwd">已向子账号发送修改密码邮件，请在邮件内点击链接重置密码</p>
                <p v-else>已向 {{scope.row.account}} 重新发送邀请邮件，请联系对方在邮件内点击链接设置密码，完成创建。</p>
              </div>
              <div slot="reference" class="name-wrapper">
                <el-button
                  type="text">修改</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="职位变更"
        class="change-position"
        :visible.sync="dialogPositionVisible"
        width="26%"
        center>
        <div class="position-item">
          <span class="text">子账号</span>
          {{currentAccount.account}}
        </div>
        <div class="position-item">
          <span class="text">职位</span>
          <el-select v-model="positionValue" placeholder="请选择" style="width: 76%;">
            <el-option
              v-for="item in positonOptions"
              :key="item.permissionId"
              :label="item.displayName"
              :value="item.permissionId">
            </el-option>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmchangePosition">确定变更</el-button>
        </span>
      </el-dialog>
      <div class="page-container" v-if="tableObj.totalPageCount > 1">
        <el-pagination
          layout="prev, pager, next"
          @current-change="getSummarys"
          :current-page="tableObj.currentPageIndex"
          :page-count="tableObj.totalPageCount">
        </el-pagination>
      </div>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import { mobileReg, emailReg } from "assets/js/utils.js"
import { formatDate } from '@/filters/filters'
export default {
  data() {
    let validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱地址"))
      } else if (!emailReg.test(value)) {
        callback(new Error("请输入正确的邮箱"))
      } else if (this.isRepeatEmail) {
        callback(new Error("邮箱地址已注册"))
      }
      callback()
    }
    let validatePermissions = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请选择职位"))
      }
      callback()
    }
    return {
      loading: false,
      dialogPositionVisible: false,
      dialogFormVisible: false,
      isRepeatEmail: false,
      tableObj: {},
      positonOptions: [],
      currentAccount: {},
      positionValue: '',
      form: {
        email: '',
        permissionId: ''
      },
      rules: {
        email: [{ validator: validateEmail, trigger: "blur" }],
        permissionId: [
          { validator: validatePermissions, trigger: "change" }
        ]
      },
      isSendEmail: false,
      tableData: []
    };
  },
  methods: {
    filterStatus(value, row) {
      return row.status == value
    },
    inviteAgain(row, column) {
      row.isPwd = false
      this.$http.put('/api/SubUser/shadow/invitation', {
        email: row.account,
        invitePageUrl: `http://www.youdianvip.com/user/user.html#/setsubpwd?account=${row.account}`
      }).then((res) => {
        if (!res.data.error) {
          row.isSuccess = true
        }
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.inviteAgain(row, column)
        })
      })
    },
    resetPwd(row, column) {
      row.isPwd = true
      this.$http.post('/api/verifycode/email', {
        email: row.account,
        pageUrl: `http://www.youdianvip.com/user/user.html#/resetpwd?account=${row.account}`
      }).then((res) => {
        console.log(res)
        if (!res.data.error) {
          row.isSuccess = true
        }
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.resetPwd(row, column)
        })
      })
    },
    confirmchangePosition() {
      this.$http.put('/api/SubUser',{
        account: this.currentAccount.account,
        remark: this.currentAccount.remark,
        permissionId: this.positionValue
      }).then((res) => {
        this.dialogPositionVisible = false
        this.getSummarys()
      }).catch((err) => {
        if (err.response.status == 400) {
          if (err.response.data.error.code == '10008') {
            this.$message.warning('该账号已被冻结')
          } else {
            this.$message.warning('该职位已被删除')
          }
          this.getPermissions(1)
        } else {
          this.loginAgain(err).then(() => {
            this.confirmchangePosition()
          })
        }
      })
    },
    changePosition(row, column) {
      this.positionValue = row.permissionId
      this.currentAccount = row
      this.dialogPositionVisible = true
    },
    deleteAccount(row, column) {
      // row.visible2 = false
      this.tableData.forEach((item, index) => {
        if (item == row) {
          this.tableObj.deleteIndex = index
          this.tableObj.deleteAccount = row.account
        }
      })
      let timer = setTimeout(() => {
        this.$http.delete('/api/SubUser', {params: {
          account: this.tableObj.deleteAccount
        }}).then((res) => {
          this.tableData.splice(this.tableObj.deleteIndex, 1)
        })
      }, 5000)
      let msgInstance = this.$message({
        dangerouslyUseHTMLString: true,
        message: `<strong>${this.tableObj.deleteAccount} 账号已删除</strong><span id="withdraw">撤回</span>`,
        duration: 5000,
        type: 'error',
        iconClass: 'el-icon-info',
        customClass: 'withdraw-delete'
      })
      document.getElementById("withdraw").addEventListener('click', () => {
        clearTimeout(timer)
        msgInstance.close()
      })
      
    },
    saveSubuser(row) {
      this.$http.put('/api/SubUser',{
        account: row.account,
        remark: row.remark,
        permissionId: row.permissionId
      }).then((res) => {
        if (!res.data.error) {
          row.cacheRemark = row.remark
          // this.$message.success('保存成功')
          row.visible = false
        } else {
          row.visible = false
          this.$message.error('保存失败')
        }
      }).catch((err) => {
        let errCode = err.response.data.error.code
        switch (errCode) {
          case '10010':
            this.$message.error('无法修改不属于你的子账号')
            break;
          case '10002':
            this.$message.error('指定更新的账号不存在')
            break;
          case '10008':
            this.$message.error('账号未激活，无法编辑')
            break;
          case '401':
            this.loginAgain(err).then(() => {
              this.saveSubuser(row)
            })
            break;
          default:
            break;
        }
        // 10010 无法修改不属于你的子账号
        // 10002 指定更新的账号不存在
        // 10008 账号未激活，无法编辑
      })
    },
    cancelPop(row) {
      row.visible = false
      row.remark = row.cacheRemark
    },
    formatterStatus(row, column, cellValue) {
      if (cellValue == 'Ok') {
        return '使用中'
      } else {
        if ((Date.now() - new Date(row.modifiedTime).getTime()) / 60 / 60 / 1000 > 24) {
          return '已失效'
        } else {
          return '待激活'
        }
      }
    },
    formatterDate(row, column, cellValue) {
      return formatDate(cellValue)
    },
    inviteShow(row, column) {
      if (row.status == 1 && (Date.now() - new Date(row.modifiedTime).getTime()) / 60 / 60 / 1000 > 24) {
        return true
      } 
      return false
    },
    showDialog() {
      this.form.email = ''
      this.form.permissionId = ''
      if (this.$refs["ruleForm"]) this.$refs["ruleForm"].resetFields()
      this.dialogFormVisible = true
      this.isSendEmail = false
    },
    invitationFn() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          // this.dialogFormVisible = false
          this.$http.post("/api/SubUser/shadow", {
            email: this.form.email,
            permissionId: this.form.permissionId,
            invitePageUrl: `http://www.youdianvip.com/user/user.html#/setsubpwd?account=${this.form.email}`
          })
          .then(res => {
            this.isSendEmail = true
            this.getSummarys(1)
            console.log(res)
          }).catch(err => {
            if (err.response.status == 401) {
              this.loginAgain(err).then(() => {
                this.invitationFn()
              })
            }
            if (err.response.status == 400 && err.response.data.error.code == '10001') {
              this.isRepeatEmail = true
              this.$refs.ruleForm.validateField('email')
              this.isRepeatEmail = false
              // this.$message.error('账号已注册为子账号')
            }
          })
        }
      })
    },
    getPermissions(pageIndex) {
      this.$http.get('/api/user/permissions/summarys', {
        params: {
          pageIndex,
          pageSize: 10
        }
      }).then((res) => {
        this.positonOptions = res.data.data.currentPageDatas
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getPermissions(pageIndex)
        })
      })
    },
    getSummarys(pageIndex) {
      this.loading = true
      this.$http.get('/api/SubUser/summarys', {
        params: {
          pageIndex,
          pageSize: 5
        // Status: '',
        // IncludeMain: true
        }
      }).then((res) => {
        this.loading = false
        this.tableObj = res.data.data
        this.tableData = res.data.data.currentPageDatas
        this.tableData.forEach((item) => {
          this.$set(item, 'cacheRemark', item.remark)
          this.$set(item, 'isSuccess', false)
        })
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getSummarys(pageIndex)
        })
      })
    }
  },
  mounted() {
    this.getSummarys(1)
    this.getPermissions(1)
  }
}
</script>

<style lang="scss">
.change-position{
  .position-item{
    margin-bottom: 18px;
    .text{
      display: inline-block;
      width: 60px;
      margin-right: 10px;
      text-align: right;
    }
    &:last-child{
      margin-bottom: 0;
    }
  }
}
.open-account{
  .el-dialog__footer{
    padding-top: 0;
  }
  .el-select{
    width: 100%;
  }
  .el-input{
    width: 97%;
  }
}
.withdraw-delete{
  width: 50%;
  color: #f56c6c;
  background: #fef0f0;
  .el-message__content{
    width: 100%;
  }
  .el-icon-info{
    color: #f56c6c;
    margin-right: 5px;
  }
  #withdraw{
    float: right;
    margin-right: 5px;
    cursor: pointer;
  }
}
.mpedit-popover{
  padding-bottom: 20px;
  .invite-success{
    width: 264px;
    text-align: center;
    .el-icon-success{
      padding: 10px;
      font-size: 30px;
      color: #67c23a;
    }
  }
}
.page-container{
  margin-top: 55px;
  text-align: center;
}
.mpmall-popover{
  padding: 12px 20px;
}
.edit-input{
  width: 180px;
  display: block;
  height: 52px;
}
.edit-text{
  text-align: center;
  margin-bottom: 10px;
}
.mp-popover{
  display: inline-block;
  .el-popover__reference{
    width: 20px;
  }
  .el-icon-edit{
    cursor: pointer;
    color: #519ae9;
    font-size: 16px;
    &:focus{
      border: none;
    }
  }
}
.email-tips {
  text-align: center;
  padding-bottom: 24px;
  .el-icon-success {
    font-size: 44px;
    color: #67c23a;
  }
  p {
    line-height: 18px;
    color: #606266;
    &:last-child {
      margin-top: 16px;
    }
  }
}
</style>
