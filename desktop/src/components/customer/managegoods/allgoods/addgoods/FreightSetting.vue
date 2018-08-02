<template>
  <div class="panel-content">
    <div class="panel-head">运费设置</div>
    <div class="spec-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="pay-ruleForm ruleForm">
        <el-form-item label="运费模板" prop="freightTemplateId">
          <el-select v-model="ruleForm.freightTemplateId" placeholder="选择运费模板" @change="changeTemplate">
            <el-option
              v-for="item in freightOptions"
              :key="item.templateId"
              :label="item.name"
              :value="item.templateId">
            </el-option>
          </el-select>
          <el-button type="text" @click="getSummarys">刷新</el-button>
          <el-button type="text" style="margin-left: 0;" @click="addFreight">新增</el-button>
        </el-form-item>
      </el-form>
      <div class="freight-table" v-show="algorithmArr.length > 0">
        <el-table
          :data="algorithmArr"
          style="width: 100%">
          <el-table-column
            prop="areaText"
            label="可配送区域"
            width="180">
          </el-table-column>
          <el-table-column
            prop="firstValue"
            :label="firstText"
            width="180">
          </el-table-column>
          <el-table-column
            prop="firstPrice"
            label="运费(元)">
          </el-table-column>
          <el-table-column
            prop="continueValue"
            :label="continueText">
          </el-table-column>
          <el-table-column
            prop="continuePrice"
            label="续费(元)">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { formatArea } from 'src/filters/filters'
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
    return {
      unitType: 2,
      isValid: false,
      freightOptions: [
        // {
        //   "templateId": 0,
        //   "name": "运费模板",
        //   "lastModifiedTime": "2018-05-30T11:16:40.044Z",
        //   "createTime": "2018-05-30T11:16:40.044Z",
        //   "storeId": 0
        // },
        // {
        //   "templateId": 1,
        //   "name": "其他模板",
        //   "lastModifiedTime": "2018-05-30T11:16:40.044Z",
        //   "createTime": "2018-05-30T11:16:40.044Z",
        //   "storeId": 0
        // }
      ],
      algorithms: [
        // {
        //   "schemes": [
        //     {
        //       "province": 110000,
        //       "city": '',
        //       "area": '',
        //       "isDefaultNationawide": true
        //     },
        //     {
        //       "province": 0,
        //       "city": 0,
        //       "area": 120101,
        //       "isDefaultNationawide": true
        //     }
        //   ],
        //   "firstPrice": 0,
        //   "firstValue": 0,
        //   "continuePrice": 0,
        //   "continueValue": 0,
        //   "constantPrice": 0,
        //   "unitType": "None"
        // }
      ],
      ruleForm: {
        freightTemplateId: this.configRuleForm.freightTemplateId || ''
      },
      rules: {
        freightTemplateId: [
          { required: true, message: '请选择运费模板', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    addFreight() {
      window.open('../../../customer/setting.html#/managetemplate/createtemplate')
    },
    changeTemplate(val) {
      this.$http.get(`/api/product/freight/template/${val}`).then((res) => {
        this.algorithms = res.data.data.algorithms
        this.unitType = res.data.data.unitType
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.changeTemplate(val)
        })
      })
    },
    validateForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.isValid = true
          return true
        } else {
          this.isValid = false
          return false
        }
      })
    },
    getSummarys() {
      this.$http.get('/api/product/freight/template/summarys', {
        params: {
          storeId: localStorage.getItem('storeId')
        }
      }).then((res) => {
        this.freightOptions = res.data.data.currentPageDatas
        let freightTemplateId = this.configRuleForm.freightTemplateId
        if (freightTemplateId) {
          this.changeTemplate(freightTemplateId)
        }
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getSummarys()
        })
      })
    }
  },
  watch: {
    configRuleForm(newVal) {
      this.ruleForm.freightTemplateId = this.configRuleForm.freightTemplateId
    }
  },
  computed: {
   algorithmArr() {
     this.algorithms.forEach((item) => {
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
     return this.algorithms
   },
   firstText() {
      switch (this.unitType) {
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
    continueText() {
      switch (this.unitType) {
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
    }
  },
  mounted () {
    this.getSummarys()
  }
}
</script>

<style lang="scss">
.panel-content{
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  background: #fff;
  margin-bottom: 24px;
  padding-bottom: 30px;
  .freight-table{
    padding-left: 100px;
  }
  .el-select{
    width: 423px;
    .el-input{
      width: 100%;
    }
  }
  .specification-content{
    margin-top: -12px;
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
      padding: 12px 20px;
      font-size: 14px;
      border: 1px solid #dcdfe5;
      border-radius: 4px;
      cursor: pointer;
      color: #606266;
    }
    .checked{
      color: red;
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
    // margin: 48px auto 0 auto;
  }
  .ruleForm{
    width: 620px !important;
    .el-button--text{
      margin-left: 10px;
    }
  }
}
</style>
