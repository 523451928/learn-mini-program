<template>
  <div class="addgoods-wrapper">
    <div class="add-goods-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item >商品管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/allgoods' }">全部商品</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
      </el-breadcrumb>
      <p>添加商品</p>
      <el-steps :active="stepIndex" align-center>
        <el-step title="商品基本信息"></el-step>
        <el-step title="商品详细信息"></el-step>
        <el-step title="其他信息"></el-step>
      </el-steps>
    </div>
    <div v-show="stepIndex == 1">
      <basic-info ref="basicInfo"></basic-info>
      <freight-setting ref="freightSetting"></freight-setting>
      <goods-specification ref="goodsSpecification"></goods-specification>
    </div>
    <div v-show="stepIndex == 2">
      <goods-detail ref="goodsDetail"></goods-detail>
    </div>
    <div v-show="stepIndex == 3">
      <other-info ref="otherInfo"></other-info>
    </div>
    <div class="submit-container">
      <el-button class="mp-large-btn" v-if="stepIndex == 1" @click="cancelFn">取消</el-button>
      <el-button class="mp-large-btn" v-else @click="prevStep">上一步</el-button>
      <el-button type="primary" class="mp-large-btn" @click="nextStep" v-if="stepIndex != 3">下一步</el-button>
      <el-button v-else type="primary" class="mp-large-btn" @click="createProduct">保存</el-button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import GoodsSpecification from './addgoods/GoodsSpecification'
import FreightSetting from './addgoods/FreightSetting'
import BasicInfo from './addgoods/BasicInfo'
import OtherInfo from './addgoods/OtherInfo'
import GoodsDetail from './addgoods/GoodsDetail'

export default {
  components: {
    GoodsSpecification,
    FreightSetting,
    BasicInfo,
    OtherInfo,
    GoodsDetail
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
      stepIndex: 1,
      selectProvinces: [],
      editIndex: -1,
      transferVisible: false,
      regions: [],
      ruleForm: {
        "name": "",
        "storeId": 0,
        "type": 1,
        "algorithms": [
          {
            "schemes": [
              {
                "province": "",
                "city": "",
                "area": "",
                "isDefaultNationawide": true
              }
            ],
            "firstValue": 0,
            "firstPrice": '0.00',
            "continueValue": 0,
            "continuePrice": '0.00'
          }
        ],
        "isDefault": true,
        "unitType": 1
      },
      rules: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations([
      'setIsChange'
    ]),
    cancelFn() {
      this.$router.push({
        path: '/allgoods'
      })
    },
    nextStep() {
      let validBasic = this.$refs.basicInfo.validateForm()
      let validFreight = this.$refs.freightSetting.validateForm()
      let validSpecification = this.$refs.goodsSpecification.validateForm()
      
      if (this.$refs.basicInfo.isValid && this.$refs.freightSetting.isValid && this.$refs.goodsSpecification.isValid && this.stepIndex == 1) {
        this.stepIndex++
      } else if(this.stepIndex == 2) {
        if (this.$refs.goodsDetail.getContent()) {
          this.stepIndex++
        } else {
          this.$message.warning('请添加商品描述')
        }
      }
    },
    createProduct() {
      let formData = Object.assign(this.$refs.basicInfo.ruleForm, this.$refs.freightSetting.ruleForm, this.$refs.otherInfo.ruleForm)
      formData.specifications = this.$refs.goodsSpecification.specifications
      if (!this.$refs.goodsSpecification.specificationList || this.$refs.goodsSpecification.specificationList.length) {
        formData.skus = this.$refs.goodsSpecification.specificationList
      } else {
        // this.$refs.goodsSpecification.skus[0].pictureUri = this.$refs.basicInfo.ruleForm.pictureUris[0]
        formData.skus = this.$refs.goodsSpecification.skus
      }
      formData.description = this.$refs.goodsDetail.getContent()
      formData.skus.forEach((item) => {
        if (!item.weight) {
          item.weight = 0
        }
        if (!item.volume) {
          item.volume = 0
        }
      })
      this.$http.post('/api/product', formData).then((res) => {
        this.$message.success('创建成功')
        this.$router.push({
          path: '/allgoods'
        })
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.createProduct()
        })
      })
    },
    prevStep() {
      this.stepIndex--
    }
  },
  computed: {
  
  },
  mounted() {
    // this.$http.get('/api/location').then((res) => {
    //   console.log(res)
    // })
  }
}
</script>

<style lang="scss">
.addgoods-wrapper{
  padding: 0;
}
.overflow-box{
  display: -webkit-box;
  width: 200px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.add-goods-header{
  padding: 30px 24px 40px 24px;
  margin-bottom: 24px;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  p{
    font-size: 20px;
    color: #303133;
    margin: 15px 0 28px 0;
  }
}
.add-goods-content{
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
        white-space: nowrap;
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
  background: #fff;
  z-index: 1000;
  box-shadow: 0 3px 15px 0 rgba(0, 0, 0, 0.1);
  padding: 16px 40px;
  position: fixed;
  bottom: 0;
  left: 324px;
  right: 34px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"]{
  -moz-appearance: textfield;
}
</style>
