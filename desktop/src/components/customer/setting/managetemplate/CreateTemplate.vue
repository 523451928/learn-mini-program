<template>
  <div>
    <div class="create-template-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item >运费模板</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/managetemplate' }">模板管理</el-breadcrumb-item>
        <el-breadcrumb-item>新建运费模板</el-breadcrumb-item>
      </el-breadcrumb>
      <p>新建运费模板</p>
    </div>
    <div class="create-template-content">
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="78px" class="template-ruleForm">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="20字以内"></el-input>
        </el-form-item>
        <el-form-item label="模板类型">
          <el-radio-group v-model="ruleForm.type">
            <el-radio :label="2">买家承担运费</el-radio>
            <el-radio :label="1">卖家包邮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="计价方式">
          <el-radio-group v-model="ruleForm.unitType">
            <el-radio :label="1">按件数</el-radio>
            <el-radio :label="2">按重量</el-radio>
            <el-radio :label="3">按体积</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配送区域">
          <p class="bold-text">默认配送</p>
          <table>
            <tr>
              <td>配送区域</td>
              <td>{{firstText}}</td>
              <td>运费(元)</td>
              <td>{{continueText}}</td>
              <td>续费(元)</td>
            </tr>
            <tbody>
              <tr>
                <td width="24%">
                  <el-checkbox v-model="ruleForm.algorithms[0].schemes[0].isDefaultNationawide">全国</el-checkbox>
                </td>
                <td>
                  <el-input :disabled="ruleForm.type == 1 || !ruleForm.algorithms[0].schemes[0].isDefaultNationawide" type="number" min="0" max="100000000" v-model="ruleForm.algorithms[0].firstValue"></el-input>
                </td>
                <td>
                  <el-input-number :disabled="ruleForm.type == 1 || !ruleForm.algorithms[0].schemes[0].isDefaultNationawide" class="number-input" :precision="2" :step="0.1" :min="0" :max="1000000" :controls="false" controls-position="right" v-model="ruleForm.algorithms[0].firstPrice" placeholder="小数点前9位，后两位数字"></el-input-number>
                  <!-- <el-input :disabled="ruleForm.type == 1 || !ruleForm.algorithms[0].schemes[0].isDefaultNationawide"  max="100000000" v-model="ruleForm.algorithms[0].firstPrice" @blur="validateFloat($event)"></el-input> -->
                </td>
                <td>
                  <el-input :disabled="ruleForm.type == 1 || !ruleForm.algorithms[0].schemes[0].isDefaultNationawide" type="number" min="0" max="100000000" v-model="ruleForm.algorithms[0].continueValue"></el-input>
                </td>
                <td>
                  <el-input-number :disabled="ruleForm.type == 1 || !ruleForm.algorithms[0].schemes[0].isDefaultNationawide" class="number-input" :precision="2" :step="0.1" :min="0" :max="1000000" :controls="false" controls-position="right" v-model="ruleForm.algorithms[0].continuePrice" placeholder="小数点前9位，后两位数字"></el-input-number>
                  <!-- <el-input :disabled="ruleForm.type == 1 || !ruleForm.algorithms[0].schemes[0].isDefaultNationawide" max="100000000" v-model="ruleForm.algorithms[0].continuePrice" @blur="validateFloat($event)"></el-input> -->
                </td>
              </tr>
            </tbody>
          </table>
          <p class="bold-text">指定配送区域（不使用默认配送区域）</p>
          <table class="appoint-table" v-if="appointAreaArr.length > 0">
            <tr>
              <td width="24%">配送区域</td>
              <td>{{firstText}}</td>
              <td>运费(元)</td>
              <td>{{continueText}}</td>
              <td>续费(元)</td>
            </tr>
            <tbody>
              <tr v-for="(item, index) in appointAreaArr" :key="index">
                <td>
                  {{item.regions | formatArea}}
                  <div>
                    <span class="mp-link" @click="editAppoint(item, index)">编辑</span>
                    <span class="mp-link" @click="deleteAppoint(index)">删除</span>
                  </div>
                </td>
                <td>
                  <el-input :disabled="ruleForm.type == 1" type="number" min="0" max="100000000" v-model="item.firstValue"></el-input>
                </td>
                <td>
                  <el-input-number :disabled="ruleForm.type == 1" class="number-input" :precision="2" :step="0.1" :min="0" :max="1000000" :controls="false" controls-position="right" v-model="item.firstPrice" placeholder="小数点前9位，后两位数字"></el-input-number>
                </td>
                <td>
                  <el-input :disabled="ruleForm.type == 1" type="number" min="0" max="100000000" v-model="item.continueValue"></el-input>
                </td>
                <td>
                  <el-input-number :disabled="ruleForm.type == 1" class="number-input" :precision="2" :step="0.1" :min="0" :max="1000000" :controls="false" controls-position="right" v-model="item.continuePrice" placeholder="小数点前9位，后两位数字"></el-input-number>
                  <!-- <el-input :disabled="ruleForm.type == 1" min="0" max="100000000" v-model="item.continuePrice" @blur="validateFloat($event)"></el-input> -->
                </td>
              </tr>
            </tbody>
          </table>
          <el-button  class="mp-large-btn" @click="addRegion">点击添加配送区域</el-button>
        </el-form-item>
        <!-- <el-form-item class="set-default">
          <el-checkbox v-model="ruleForm.isDefault">设置为默认模板</el-checkbox>
        </el-form-item> -->
      </el-form>
    </div>
    <div class="submit-container">
      <el-button class="mp-large-btn" @click="toManage">取消</el-button>
      <el-button type="primary" class="mp-large-btn" @click="saveTemplate">保存</el-button>
    </div>
    <mp-transfer @hide="cancelFn" v-if="transferVisible" ref="mpTransfer" :selectProvinces="selectProvinces" :regions="regions" :checkedRegions="checkedRegions"  @comfirm="confirmFn"></mp-transfer>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { area, findPlaceByValue, adMap } from 'assets/json/area'
import { removeRepeat } from 'assets/js/utils.js'
import { formatArea } from 'src/filters/filters'
import { mixinsValidate } from 'assets/js/mixins.js'
import MpTransfer from 'components/public/MpTransfer'
export default {
  mixins: [mixinsValidate],
  components: {
    MpTransfer
  },
  data() {
    let validateName = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error('请输入模板名称'))
      } else if(value.length > 20) {
        callback(new Error('模板名称在20字以内'))
      }
      callback()
    }
    return {
      backFill: [],
      selectProvinces: [],
      editIndex: -1,
      editItme: {},
      transferVisible: false,
      regions: [],
      ruleForm: {
        "name": "",
        "storeId": localStorage.getItem('storeId'),
        "type": 2,
        "algorithms": [
          {
            "schemes": [
              {
                "province": 0,
                "city": 0,
                "area": 0,
                "isDefaultNationawide": true
              }
            ],
            "firstValue": 0,
            "firstPrice": '0.00',
            "continueValue": 0,
            "continuePrice": '0.00'
          }
        ],
        "isDefault": false,
        "unitType": 1
      },
      rules: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ]
      },
      appointAreaArr: [
        // {
        //   firstValue: 0,
        //   firstPrice: 0,
        //   continueValue: 0,
        //   continuePrice: 0,
        //   regions: [],
        //   areaText: ''
        // }
      ]
    }
  },
  methods: {
    ...mapMutations([
      'setIsChange'
    ]),
    toManage() {
      this.$router.push({
        path: '/managetemplate'
      })
    },
    saveTemplate() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.appointAreaArr.forEach((item, index) => {
            this.ruleForm.algorithms.push(item)
          })
          let ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
          if (!ruleForm.algorithms[0].schemes[0].isDefaultNationawide) {
            ruleForm.algorithms.splice(0, 1)
          }
          if (!ruleForm.algorithms.length) {
            this.$message.warning('请选择配送区域')
            return
          }
          this.$http.post('/api/product/freight/template', ruleForm).then((res) => {
            this.$message.success('创建成功')
            this.toManage()
          }).catch((err) => {
            if (err.response.status == 400 && err.response.data.error.code == 30010) {
              this.$message.warning('模板名称已存在')
              return
            }
            this.loginAgain(err).then(() => {
              this.saveTemplate()
            })
          })
        }
      })
    },
    deleteAppoint(index) {
      this.appointAreaArr.splice(index, 1)
    },
    editAppoint(item, index) {
      let provinces = item.schemes.map((pro) => {
        return pro.provinceCode
      })
      this.selectProvinces = removeRepeat(provinces)
      this.editIndex = index
      this.editItme = item
      this.regions = item.regions
      this.transferVisible = true
    },
    addRegion() {
      this.selectProvinces = []
      this.editIndex = -1
      this.regions = []
      this.transferVisible = true
    },
    confirmFn(obj) {
      this.transferVisible = false
      if (obj.regions.length > 0) {
        if (this.editIndex == -1) {
          this.appointAreaArr.push(obj)
        } else {
          obj.constantPrice = this.editItme.constantPrice
          obj.continuePrice = this.editItme.continuePrice
          obj.continueValue = this.editItme.continueValue
          obj.firstPrice = this.editItme.firstPrice
          obj.firstValue = this.editItme.firstValue
          this.appointAreaArr[this.editIndex] = obj
        }
      }
    },
    cancelFn() {
      this.transferVisible = false
    }
  },
  filters: {
    formatArea
  },
  computed: {
    checkedRegions: {
      get() {
        let arr = []
        this.appointAreaArr.forEach((item, index) => {
          if (index != this.editIndex) {
            arr = arr.concat(item.regions) 
          }
        })
        return arr
      },
      set(val) {
        console.log(val)
      }
    },
    firstText() {
      switch (this.ruleForm.unitType) {
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
      switch (this.ruleForm.unitType) {
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
  mounted() {
    this.$http.get('/api/location').then((res) => {
      
    })
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
.create-template-header{
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
.create-template-content{
  padding: 48px 24px;
  padding-left: 50px;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  .el-form-item{
    margin-bottom: 18px;
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
