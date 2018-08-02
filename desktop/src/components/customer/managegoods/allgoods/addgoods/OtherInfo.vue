<template>
  <div class="panel-content">
    <div class="panel-head">其他信息</div>
    <div class="spec-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="pay-ruleForm">
        <el-form-item label="商品排序" prop="order">
          <el-input-number class="full-input" v-model="ruleForm.order" controls-position="right" :controls="false" :min="0" :max="999999999"></el-input-number>
          <p class="tips">数字越大，排序越前</p>
        </el-form-item>
        <el-form-item label="库存计算方式">
          <div>
             <el-radio disabled v-model="ruleForm.stockComputeType" label="AfterPlacedOrder">下单减库存</el-radio>
             <el-radio disabled v-model="ruleForm.stockComputeType" label="other">支付减库存</el-radio>
             <el-popover
              placement="bottom"
              width="200"
              trigger="hover"
              class="mp-popover">
              <div>暂时只支持下单减库存，我们会尽快适配支付减库存。</div>
              <span class="el-icon-question" slot="reference"></span>
            </el-popover>
          </div>
        </el-form-item>
        <el-form-item label="上架时间">
          <div>
             <el-radio v-model="ruleForm.status" label="Onsell">立即上架</el-radio>
             <el-radio v-model="ruleForm.status" label="Offsell">暂不上架</el-radio>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mobileReg, emailReg } from 'assets/js/utils.js'
export default {
  props: {
    configRuleForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    let validateOrder = (rule, value, callback) => {
      if (value > 10000000) {
        callback(new Error('请输入9位以内的数字'))
      }
      callback()
    }
    return {
      ruleForm: {
        stockComputeType: 'AfterPlacedOrder',
        status: this.configRuleForm.status || 'Onsell',
        order: this.configRuleForm.order || ''
      },
      rules: {
        contacter: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        order: [
          { validator: validateOrder, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    configRuleForm(newVal) {
      this.ruleForm.status = newVal.status == 1 ? 'Onsell' : 'Offsell'
      this.ruleForm.order = newVal.order
    }
  },
  methods: {
    addSpec() {
      this.isAddVisible = true
      this.specForm.specName = ''
      this.specForm.specValue = ''
    },
    validateForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          return true
        } else {
          return false
        }
      })
    }
  },
  computed: {
   
  }
}
</script>

<style lang="scss">
.panel-content{
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  background: #fff;
  margin-bottom: 24px;
  padding-bottom: 30px;
  .specification-content{
    margin-top: -12px;
  }
  .mp-popover{
    margin-left: 4px;
    position: relative;
    top: 1px;
  }
  .full-input{
    width: 100% !important;
    input{
      text-align: left;
    }
  }
  .el-input{
    width: 100% !important;
  }
  .table-content{
    margin-left: 100px;
    margin-top: 20px;
    .batch-setting{
      font-size: 14px;
      .batch-text{
        color: #7d8087;
        font-weight: bold;
        margin-right: 70px;
        margin-left: 15px;
      }
      .el-input{
        width: 110px;
        margin-right: 23px;
      }
      .el-button--primary{
        margin-left: 0;
      }
    }
    table{
      width: 100%;
      tr{
        line-height: 44px;
        border-bottom: 1px solid #ebeef5;
        td{
          margin: 10px;
          vertical-align: middle;
          text-indent: 15px;
          font-size: 14px;
          color: #7d8087;
          font-weight: bold;
        }
      }
      tbody{
        tr{
          line-height: 70px;
          td{
            color: #4d4f53;
            font-weight: normal;
            .avatar-uploader{
              height: 70px;
            }
            .avatar-uploader-icon{
              width: 56px;
              height: 56px;
              border: 1px dashed #d9d9d9;
              border-radius: 6px;
              cursor: pointer;
              position: relative;
              overflow: hidden;
              line-height: 56px;
              text-indent: 0;
              top: 5px;
              left: -15px;
            }
            img{
              height: 60px;
              margin-top: 5px;
            }
            .el-input{
              width: 110px;
              margin: 0;
              text-indent: 0;
            }
          }
        }
      }
    }
  }
  .spec-container{
    padding: 40px 10px 40px 55px;
    .el-button-primary{
      margin-left: 96px;
    }
    .add-btn{
      margin-top: 25px;
    }
  }
  .spec-item{
    margin-left: 98px;
    p{
      line-height: 40px;
      color: #606266;
      font-weight: bold;
      font-size: 14px;
      margin-top: 12px;
    }
    .tag{
      margin-right: 10px;
      display: inline-block;
      padding: 10px 20px;
      font-size: 14px;
      border: 1px solid #dcdfe5;
      border-radius: 4px;
      cursor: pointer;
      color: #606266;
    }
  }
  .specForm{
    width: 490px;
    margin-top: 24px;
  }
  .input-with-append{
    width: 250px !important;
  }
  .el-icon-question{
    color: #cccccc;
  }
  .panel-head{
    line-height: 50px;
    text-indent: 25px;
    border-bottom: 1px solid #ebeef5;
  }
  .el-input{
    width: 90%;
    margin-right: 10px;
  }
  .pay-ruleForm{
    width: 520px;
    .tips{
      line-height: 1;
      font-size: 14px;
      color: #909399;
      margin-top: 6px;
    }
    // margin: 48px auto 0 auto;
  }
}
</style>
