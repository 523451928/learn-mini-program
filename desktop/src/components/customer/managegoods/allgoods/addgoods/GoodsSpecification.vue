<template>
  <div class="panel-content">
    <div class="panel-head">商品规格</div>
    <div class="spec-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="pay-ruleForm">
        <el-form-item>
          <el-radio v-model="specification" label="1">统一规格</el-radio>
          <el-radio v-model="specification" label="2">多规格</el-radio>
        </el-form-item>
        <div v-show="!isMultiple">
          <el-form :model="skus[0]" :rules="skusRules" ref="skusRules" label-width="100px">
            <el-form-item label="商品编码">
              <el-input type="text" v-model="skus[0].code" auto-complete="off" placeholder="20字以内"></el-input>
            </el-form-item>
            <el-form-item label="现价" prop="price">
              <el-input-number class="number-input" v-model="skus[0].price" :precision="2" :step="0.1" :min="0" :max="1000000" :controls="false" controls-position="right" placeholder="小数点前10位，后两位数字"></el-input-number>
            </el-form-item>
            <el-form-item label="原价" >
              <el-input-number class="number-input" :precision="2" :step="0.1" :min="0" :max="1000000" :controls="false" controls-position="right" v-model="skus[0].realityPrice" placeholder="小数点前10位，后两位数字"></el-input-number>
            </el-form-item>
            <el-form-item label="成本价">
              <el-input-number class="number-input" :precision="2" :step="0.1" :min="0" :max="1000000" :controls="false" controls-position="right" type="text" v-model="skus[0].costPrice" placeholder="小数点前10位，后两位数字"></el-input-number>
            </el-form-item>
            <el-form-item label="库存" prop="stock">
              <el-input type="text" v-model="skus[0].stock" auto-complete="off" placeholder="6字以内"></el-input>
            </el-form-item>
            <el-form-item label="重量(kg)">
              <el-input-number class="number-input" :precision="2" :step="0.1" :min="0" :max="1000000" :controls="false" controls-position="right" v-model="skus[0].weight"  placeholder="小数点前9位，后两位数字"></el-input-number>
            </el-form-item>
            <el-form-item label="体积(M3)">
              <el-input-number class="number-input" :precision="2" :step="0.1" :min="0" :max="1000000" :controls="false" controls-position="right" v-model="skus[0].volume" placeholder="小数点前9位，后两位数字"></el-input-number>
            </el-form-item>
          </el-form>
        </div>
      </el-form>
      <div v-show="isMultiple" class="specification-content">
        <div>
          <div v-for="spec in specificationArr" :key="spec.specName" class="spec-item">
            <p>{{spec.specName}}</p>
            <div>
              <span v-for="tag in spec.specValues" @click="selectSpec(spec, tag)" :key="tag.value" class="tag" :class="{'checked': tag.checked}">
                {{tag.value}}
                <img v-if="tag.checked" src="./selectStyle.png">
              </span>
              <el-input placeholder="请输入内容" v-model="spec.tag" @keyup.native.enter="addTag(spec)" class="input-with-append">
                <el-button @click="addTag(spec)" slot="append">添加</el-button>
              </el-input>
            </div>
          </div>
        </div>
        <el-button @click="addSpec" v-if="!isAddVisible" type="primary" :class="{'add-btn': specificationArr.length > 0}" style="margin-left:98px;">添加规格</el-button>
        <el-form v-else :model="specForm" :rules="specRules" ref="specForm" label-width="100px" class="specForm">
          <el-form-item label="规格名" prop="specName">
            <el-input type="text" v-model="specForm.specName" auto-complete="off" placeholder="5字以内"></el-input>
          </el-form-item>
          <el-form-item label="规格值" prop="specValue">
            <el-input type="text" v-model="specForm.specValue" auto-complete="off" placeholder="20字以内"></el-input>
          </el-form-item>
          <el-button @click="comfirmAdd" type="primary" style="margin-left:98px;">确定</el-button>
          <el-button @click="isAddVisible = false">取消</el-button>
        </el-form>
        <div class="table-content" v-show="specificationList.length > 0">
          <div class="batch-setting">
            <span class="batch-text">批量设置</span>
            <el-input v-model="code" placeholder="商品编码" type="number"></el-input>
            <el-input v-model="price" placeholder="现价" type="number"></el-input>
            <el-input v-model="realityPrice" placeholder="原价" type="number"></el-input>
            <el-input v-model="costPrice" placeholder="成本价" type="number"></el-input>
            <el-input v-model="stock" placeholder="库存" type="number"></el-input>
            <el-input v-model="weight" placeholder="重量" type="number"></el-input>
            <el-input v-model="volume" placeholder="体积" type="number"></el-input>
            <el-button type="primary" @click="batchSetting">确定</el-button>
          </div>
          <table>
            <thead>
              <tr>
                <!-- <td v-for="(item, key) in res" :key="item.name" v-show="titleShow(item)">{{key}}</td> -->
                <td class="spec-td" v-for="(item, index) in formatTitle" :key="index" >{{item}}</td>
                <td>规格图片</td>
                <td>商品编码</td>
                <td>现价</td>
                <td>原价</td>
                <td>成本价</td>
                <td>库存</td>
                <td>重量（kg）</td>
                <td>体积（m3）</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in specificationList" :key="index">
                <!-- <td v-for="(itm, idx) in item.specifications" :key="idx" v-if="itm.value">
                  {{itm.value}}
                </td> -->
                <td class="spec-td" v-for="(itm, idx) in formatSkus[index]" :key="idx" :rowspan="rowSpans[idx]" v-if="index % rowSpans[idx] == 0 && rowSpans[idx] > 1">
                  {{itm}}
                </td>
                <td class="spec-td" v-for="(itm, idx) in formatSkus[index]" :key="idx" v-if="rowSpans[idx] == 1">
                  {{itm}}
                </td>
                <td>
                  <el-upload
                    @click.native="uploadImg(item)"
                    class="avatar-uploader"
                    action="https://wxim.juketool.com/Files/Upload"
                    :show-file-list="false"
                    :on-change="handleChangePic"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="item.pictureUri != ''" :src="item.pictureUri" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </td>
                <td><el-input v-model="item.code"  type="number"></el-input></td>
                <td>
                  <el-input-number class="mp-number-input" :precision="2" :step="0.1" :min="0" :max="1000000" :controls="false" v-model="item.price"></el-input-number>
                </td>
                <td>
                  <el-input-number class="mp-number-input" :precision="2" :step="0.1" :min="0" :max="1000000" :controls="false" v-model="item.realityPrice"></el-input-number>
                </td>
                <td>
                  <el-input-number class="mp-number-input" :precision="2" :step="0.1" :min="0" :max="1000000" :controls="false" v-model="item.costPrice"></el-input-number>
                </td>
                <td><el-input v-model="item.stock"  type="number"></el-input></td>
                <td><el-input v-model="item.weight"  type="number"></el-input></td>
                <td><el-input v-model="item.volume"  type="number"></el-input></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { trim, removeRepeat, indexofArr, doExchange, calculateRowspan } from 'assets/js/utils.js'
import { mixinsValidate } from 'assets/js/mixins.js'
export default {
  // mixins: [mixinsValidate],
  props: {
    configRuleForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    let validateSpecName = (rule, value, callback) => {
      if (value.length > 5) {
        callback(new Error('请输入5字以内的规格名'))
      } else if(this.specNameArr.includes(this.specForm.specName)) {
        callback(new Error('请输入不重复的规格名'))
      }
      callback()
    }
    return {
      isValid: false,
      code:'',
      price: '',
      realityPrice: '',
      costPrice: '',
      stock: '',
      weight: '',
      volume: '',
      isAddVisible: false,
      skus: [
        {
          "specifications": [
          ],
          "pictureUri": "",
          "price": '',
          "realityPrice": '',
          "costPrice": '',
          "code": "",
          "stock": 0,
          "weight": '',
          "volume": ''
        }
      ],
      skusRules: {
        price: [
           { required: true, message: '请输入商品现价', trigger: 'blur' },
        ],
        stock: [
           { required: true, message: '请输入商品库存', trigger: 'blur' },
        ]
      },
      specification: '1',
      specificationArr: [],
      specificationList: [],
      cacheSpecificationList: [],
      specList: [],
      res: {},
      result: [],
      ruleForm: {
        appId: this.configRuleForm.appId
      },
      rules: {
        
      },
      specForm: {
        specName: '',
        specValue: ''
      },
      specRules: {
        specName: [
          { required: true, message: '请输入模版名称', trigger: 'blur' },
          { validator: validateSpecName, trigger: 'blur' }
        ],
        specValue: [
          { required: true, message: '请输入规格值', trigger: 'blur' },
          { min: 1, max: 20, message: '请输入20字以内的规格值', trigger: 'blur' }
        ]
      },
      editItem: {},
      rowSpans: [],
      formatTitle: [],
      formatSkus: []
    }
  },
  methods: {
    validateFloat(e) {
      let value = e.target.value
      if (!value) {
        value = '0'
        e.target.value = '0.00'
      }
      if (value.length > 4 && value[0] == 0) {
        e.target.value = value.slice(1)
      }
      if (value.indexOf('.') == -1) {
        e.target.value = value + '.00'
      } else {
        let numArr = value.split('.')
        if (numArr[1].length >= 2) {
          e.target.value = numArr[0] + '.' + numArr[1].slice(0, 2)
        } else if (numArr[1].length == 1) {
          e.target.value = numArr[0] + '.' + `${numArr[1]}0`
        } else {
          e.target.value = numArr[0] + '.' + '00'
        }
      }
    },
    uploadImg(item) {
      this.editItem = item
    },
    handleChangePic(file, fileList) {
      if (file.response) {
        this.editItem.pictureUri = file.response.Url
      }
    },
    beforeAvatarUpload(file, item) {
      const isImg = file.type.indexOf("image/") != -1
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImg) {
        this.$message.error('请上传图片!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isImg && isLt2M
    },
    batchSetting() {
      this.specificationList.forEach((item) => {
        item.code = this.code
        item.price = this.price
        item.realityPrice = this.realityPrice
        item.costPrice = this.costPrice
        item.stock = this.stock
        item.weight = this.weight
        item.volume = this.volume
      })
    },
    titleShow(item) {
      if (item.length > 0) {
        return true
      }      
      return false
    },
    addSpec() {
      this.isAddVisible = true
      this.specForm.specName = ''
      this.specForm.specValue = ''
    },
    selectSpec(spec, tag) {
      this.specificationArr.forEach((item) => {
        let hasChecked = false
        item.specValues.forEach((itm) => {
          if (itm.checked) {
            hasChecked = true
          }
        })
        if (hasChecked) {
          this.$set(item, 'hasChecked', true)
        } else {
          this.$set(item, 'hasChecked', false)
        }
      })
      let checkedNames = this.specificationArr.filter((item) => {
        return item.hasChecked
      })
      if (checkedNames.length >= 5 && !spec.hasChecked) {
        this.$message.warning('规格名最多同时有5条生效')
        return
      }
      let title = spec.specName
      let v = tag.value
      if (!this.res[title]) {
        this.res[title] = [v]
      } else {
        if (indexofArr(this.res[title], v) == -1) {
          this.res[title].push(v)
        } else {
          let index = indexofArr(this.res[title], v)
          this.res[title].splice(index, 1)
        }
      }
      let arr1 = []
      for (let t in this.res) {
        if (this.res[t].length > 0) {
          arr1.push(this.res[t])
        }
      }
      this.result = doExchange(arr1)
      let list = []
      if (this.result) {
        this.result.forEach((item, index) => {
          let sku = {
            specifications: [
              
            ],
            pictureUri: "",
            price: 0,
            realityPrice: 0,
            costPrice: 0,
            code: "",
            stock: 0,
            weight: 0,
            volume: 0
          }
          let i = 0
          for (let key in this.res) {
            let obj = {}
            let obj2 = {}
            obj[key] = item.split(',')[i]
            if (obj[key]) {
              obj2 = {
                name: key,
                value: item.split(',')[i]
              }
            }
            i++
            if (obj2.value) sku.specifications.push(obj2)
          }
          list.push(sku)
        })
      }
      this.specificationList = list
      this.cacheSpecificationList.forEach((item) => {
        this.specificationList.forEach((itm, index) => {
          if (JSON.stringify(item.specifications) == JSON.stringify(itm.specifications)) {
            this.specificationList[index] = item
          }
        })
      })
      if (!tag.hasOwnProperty('checked')) this.$set(tag, 'checked', false)
      tag.checked = !tag.checked
      if (tag.checked) {
        this.specList.push({
          name: spec.specName,
          value: tag.value
        })
      } else {
        let index = -1
        this.specList.forEach((item, idx) => {
          if (item.value == tag.value) {
            index = idx
          }
        })
        this.specList.splice(index, 1)
      }
    },
    addTag(spec) {
      let specValues = spec.specValues.map((item) => {
        return item.value
      })
      let value = trim(spec.tag)
      if (specValues.includes(value)) {
        this.$message.warning(`${value}已经存在`)
        return
      }
      if (!value) {
        return
      }
      if (value.length > 20) {
        this.$message.warning('请输入20字以内的规格值')
        return
      }
      spec.specValues.push({
        value,
        checked: false
      })
      spec.tag = ''
    },
    comfirmAdd() {
      this.$refs['specForm'].validate((valid) => {
        if (valid) {
          if (this.specificationArr.length <= 20) {
            this.specificationArr.push({
              specName: this.specForm.specName,
              specValues: [{value: this.specForm.specValue, checked: false}]
            })
          } else {
            this.$message.warning('规格名最多添加20条')
          }
          this.specForm.specName = ''
          this.specForm.specValue = ''
        }
      })
    },
    validateForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          return true
        } else {
          return false
        }
      })
      if (this.specification == 1) {
        this.$refs['skusRules'].validate((valid) => {
          if (valid) {
            this.isValid = true
            return true
          } else {
            this.isValid = false
            return false
          }
        })
      } else {
        let arr = this.specificationList
        let isValid = true
        if (!arr.length) {
          this.$message.warning('请添加商品规格')
          isValid = false
        }
        for (let i = 0;i < arr.length;i++) {
          if (arr[i].price === '' || arr[i].price === undefined) {
            this.$message.warning('请输入商品现价')
            isValid = false
            break
          }
          if (arr[i].stock === ''|| arr[i].stock === undefined) {
            this.$message.warning('请输入商品库存')
            isValid = false
            break
          }
        }
        this.isValid = isValid
      }
    }
  },
  watch: {
    specificationArr: {
      handler(newVal) {
        let checkedSpecArr = []
        newVal.forEach((item) => {
          let checkedSpecValues = item.specValues.filter(spec => spec.checked).map(spe => spe.value)
          if (checkedSpecValues.length) checkedSpecArr.push(checkedSpecValues)
        })
        this.rowSpans = calculateRowspan(checkedSpecArr).row
        let result = calculateRowspan(checkedSpecArr).res
        let formatList = []
        result.forEach((item) => {
          let copyItem = [...item]
          let sortItem = JSON.stringify(copyItem.sort((a, b) => a > b))
          this.specificationList.forEach((specs) => {
            let sortSpec = JSON.stringify(specs.specifications.map(spec => spec.value).sort((a, b) => a > b))
            if (sortItem == sortSpec) {
              formatList.push(specs)
            }
          })
        })
        let formatTitle = []
        result[0].forEach((item) => {
          for (let key in this.res) {
            if (this.res[key].includes(item)) {
              formatTitle.push(key)
            }
          }
        })
        this.formatSkus = result
        this.formatTitle = formatTitle
        this.specificationList = formatList
        this.cacheSpecificationList = formatList
      },
      immediate: true,
      deep: true
    },
    configRuleForm(newVal) {
      if (newVal.skus.length == 1) {
        this.skus[0] = newVal.skus[0]
      }
      if (this.configRuleForm.specifications) {
        if (this.configRuleForm.specifications.length > 0) {
          this.specification = '2'
        }
        let checkedValues = []
        this.specificationList = this.configRuleForm.skus
        this.specificationList.forEach((item) => {
          let arrs = item.specifications
          let specifications = []
          item.specifications = item.specifications.sort((a, b) => {
            return a.name < b.name
          })
          let maps = {}
          for (let i = 0; i < arrs.length; i++) {
            let ai = arrs[i]
            if (!maps[ai.name]) {
              specifications.push({
                name: ai.name,
                values: [ai.value]
              })
              maps[ai.name] = ai
            } else {
              for (let j = 0; j < specifications.length; j++) {
                let dj = specifications[j]
                if (dj.name == ai.name) {
                    dj.values.push(ai.value)
                    break;
                }
              }
            }
          }
          specifications.forEach((item) => {
            this.res[item.name] = []
          })
          item.specifications.forEach((sku) => {
            checkedValues.push(sku.value)
          })
        })
        checkedValues = removeRepeat(checkedValues)
        let arr = this.configRuleForm.specifications
        let map = {},
            specificationArr = [];
        for (let i = 0; i < arr.length; i++) {
          let ai = arr[i]
          if (!map[ai.name]) {
            let obj = {value: ai.value}
            if (checkedValues.includes(ai.value)) {
              obj.checked = true
            }
            specificationArr.push({
              specName: ai.name,
              specValues: [obj]
            })
            map[ai.name] = ai
          } else {
            let obj = {value: ai.value}
            if (checkedValues.includes(ai.value)) {
              obj.checked = true
            }
            for (let j = 0; j < specificationArr.length; j++) {
              let dj = specificationArr[j]
              if (dj.specName == ai.name) {
                  dj.specValues.push(obj)
                  break;
              }
            }
          }
        }
        this.specificationArr = specificationArr
        specificationArr.forEach((item) => {
          for (let key in this.res) {
            if (item.specName == key) {
              item.specValues.forEach((itm) => {
                if (itm.checked) {
                  this.res[key].push(itm.value)
                }
              })
            }
          }
        })
      }
    }
  },
  mounted () {
  },
  computed: {
    specifications() {
      let arr = []
      this.specificationArr.forEach((item) => {
        item.specValues.forEach((spec) => {
          arr.push({
            name: item.specName,
            value: spec.value
          })
        })
      })
      return arr
    },
    specNameArr() {
      return this.specificationArr.map((spec) => {
        return spec.specName
      })
    },
    isMultiple() {
      if (this.specification == '2') {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/css/mixin.scss';
@media screen and (max-width: 1500px) {
  .panel-content .table-content .batch-setting .el-input{
    width: 90px !important;
  }
}
.panel-content{
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  background: #fff;
  margin-bottom: 24px;
  padding-bottom: 30px;
  .number-input{
    width: 420px !important;
    .el-input__inner{
      text-align: left;
    }
  }
  .specification-content{
    margin-top: -12px;
  }
  .table-content{
    margin-left: 100px;
    margin-top: 20px;
    overflow-x: auto;
    overflow-y: hidden;
    @include scrollBar;
    .batch-setting{
      font-size: 14px;
      margin-bottom: 10px;
      white-space: nowrap;
      .batch-text{
        color: #7d8087;
        font-weight: bold;
        margin-right: 70px;
        margin-left: 15px;
      }
      .el-input{
        width: 8%  !important;
        min-width: 90px !important;
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
          white-space: nowrap;
          min-width: 80px;
        }
      }
      .spec-td{
        min-width: 70px;
      }
      tbody{
        tr{
          line-height: 70px;
          
          td{
            color: #4d4f53;
            font-weight: normal;
            white-space: nowrap;
            min-width: 110px;
            .mp-number-input{
              width: auto;
              .el-input__inner{
                text-align: left;
              }
            }
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
              margin: 5px auto;
              display: block;
            }
            .el-input{
              width: 60%  !important;
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
      margin: 0 10px 10px 0;
      display: inline-block;
      padding: 12px 20px;
      font-size: 14px;
      border: 1px solid #dcdfe5;
      border-radius: 4px;
      cursor: pointer;
      color: #606266;
      position: relative;
      img{
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
    .checked{
      color: #606266;
      border-color: #3c9dff;
      background: #eef6ff;
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
}
</style>
