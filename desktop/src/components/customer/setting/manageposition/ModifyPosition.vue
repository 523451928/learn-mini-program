<template>
  <div>
    <div class="create-position-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item >员工管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manageposition' }">职位管理</el-breadcrumb-item>
        <el-breadcrumb-item>修改职位</el-breadcrumb-item>
      </el-breadcrumb>
      <p>修改职位</p>
    </div>
    <div class="create-position-content">
      <el-form label-position="right" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="78px" class="template-ruleForm">
         <el-form-item label="职位名称" prop="displayName">
          <el-input v-model="ruleForm.displayName" placeholder="20字以内"></el-input>
        </el-form-item>
        <el-form-item label="职位描述" prop="description">
          <el-input type="textarea" v-model="ruleForm.description" placeholder="最多50字" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
          <span class="count-text" :class="{'danger-text': ruleForm.description.length > 50, 'default-text':  ruleForm.description.length > 0}">{{ruleForm.description.length}} / 50</span>
        </el-form-item>
        <el-form-item label="权限">
          <div>
            <el-checkbox :checked="true" :disabled="true">首页</el-checkbox>
          </div>
          <el-tree
            ref="elTree"
            :data="enablePermissions"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
            :default-checked-keys="defaultChecked"
            :props="defaultProps">
          </el-tree>
        </el-form-item>
      </el-form>
    </div>
    <div class="submit-container">
      <el-button type="primary" class="mp-large-btn" @click="modifyPosition">保存</el-button>
    </div>
  </div>
</template>

<script>
import { removeRepeat } from 'assets/js/utils.js'
import { permissionsData } from '@/assets/json/permissionsData'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      // backFill: [ HomeIndex, StoreFacade, Product, ProductGroup, Order, Coupon, MiniAppAuthorize, MiniAppAudit, PaymentConfiguration, ForwardSetting, FreightTemplate, CustomerSetting ],
      defaultChecked: [],
      permissionsData,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      ruleForm: {
        displayName: '',
        description: '',
        actions: ['HomeIndex']
      },
      rules: {
        displayName: [
          { required: true, message: '请填写职位名称', trigger: 'blur' },
          { min: 0, max: 20, message: '请输入20字以内的职位名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请填写职位描述', trigger: 'blur' },
          { min: 1, max: 50, message: '请输入50字以内的职位描述', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    toManage() {
      this.$router.push({
        path: '/manageposition'
      })
    },
    fillBackFn(id) {
      this.$http.get(`/api/user/permissions/${id}`).then((res) => {
        this.ruleForm = Object.assign(this.ruleForm, res.data.data) 
        let actions = res.data.data.actions
        this.defaultChecked = actions
        if (this.$refs.elTree) this.$refs.elTree.setCheckedKeys(actions, true)
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.fillBackFn(id)
        })
      })
    },
    modifyPosition() {
      let data = this.$refs.elTree.getCheckedKeys()
      this.ruleForm.actions = ['HomeIndex'].concat(data.filter(i => i >= 0 || typeof i == 'string'))
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$http.put('/api/user/permissions', this.ruleForm).then((res) => {
            this.$message.success('修改成功')
            this.toManage()
          }).catch((err) => {
            this.loginAgain(err).then(() => {
              this.modifyPosition()
            })
          })
        }
      })
    },
    confirmFn(obj) {
      this.transferVisible = false
      if (obj.regions.length > 0) {
        if (this.editIndex == -1) {
          this.appointAreaArr.push(obj)
        } else {
          this.appointAreaArr[this.editIndex] = obj
        }
      }
    }
  },
  filters: {
  },
  computed: {
    ...mapState([
      'permissions'
    ]),
    enablePermissions() {
      let permissions = [...this.permissionsData]
      permissions.forEach((item) => {
        item.children.forEach((itm) => {
          if (typeof itm.id == 'string') this.$set(itm, 'disabled', true)
          if (this.permissions.includes(itm.id)) {
            itm.disabled = false
          }
          if (itm.children) {
            itm.children.forEach((it) => {
              if (typeof it.id == 'string')  this.$set(it, 'disabled', true)
              if (this.permissions.includes(it.id)) {
                it.disabled = false
              }
            })
          }
        })
      })
      return permissions
    }
  },
  mounted() {
    let permissionId = this.$router.currentRoute.query.permissionid
    this.ruleForm.permissionId = permissionId
    this.fillBackFn(permissionId)
  }
}
</script>

<style lang="scss">
.number-input{
  .el-input__inner{
    text-align: left;
    padding-right: 0 !important;
  }
}
.el-input-number{
  width: auto;
}
.overflow-box{
  display: -webkit-box;
  width: 200px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.create-position-header{
  padding: 30px 24px;
  margin-bottom: 24px;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  p{
    font-size: 20px;
    color: #303133;
    margin-top: 15px;
  }
}
.create-position-content{
  padding: 48px 24px;
  padding-left: 50px;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  .el-form-item{
    margin-bottom: 18px;
    .el-form-item__content{
      width: 374px;
    }
    .el-textarea{
      margin-top: 8px;
    }
    .count-text{
      position: absolute;
      right: 3px;
      bottom: 0;
      color: #c9ccd3;
    }
    .default-text{
      color: #606266;
    }
    .danger-text{
      color: #F56C6C;
    }
  }
  .el-input{
    width: 374px;
  }
  table{
    width: 100%;
    margin-bottom: 26px;
    color: #7d8087;
    tbody{
      td{
        padding: 16px 0;
      }
    }
    tr{
      border-bottom: 1px solid #ebeef5;
      td{
        padding-left: 22px;
      }
    }
    .el-input{
      width: 96px;
    }
  }
  .appoint-table{
    tbody{
      color: #606266;
      tr{
        vertical-align: top;
        td{
          vertical-align: top;
          line-height: 20px;
        }
      }
    }
  }
  .set-default{
    margin-top: 40px;
  }
}
.submit-container{
  text-align: center;
  margin: 50px 0;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"]{
  -moz-appearance: textfield;
}
</style>
