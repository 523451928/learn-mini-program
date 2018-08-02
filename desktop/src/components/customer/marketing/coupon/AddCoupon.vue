<template>
  <div class="add-coupon">
    <div class="add-coupon-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item >营销工具</el-breadcrumb-item>
        <el-breadcrumb-item :to="couponRouter">{{couponRouter.text}}</el-breadcrumb-item>
        <el-breadcrumb-item>添加优惠券</el-breadcrumb-item>
      </el-breadcrumb>
      <p>添加优惠券</p>
    </div>
    <div class="add-coupon-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="coupon-ruleForm">
        <el-form-item label="优惠券名称" prop="displayName">
          <el-input type="text" v-model="ruleForm.displayName" auto-complete="off" placeholder="20字以内">
          </el-input>
        </el-form-item>
        <el-form-item label="优惠类型" prop="type">
          <el-select v-model="ruleForm.type" placeholder="选择类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="减免金额" prop="constantValue" v-if="ruleForm.type == 'constant'">
          <el-input type="number" v-model="ruleForm.constantValue" auto-complete="off">
            <i slot="suffix">元</i>
          </el-input>
        </el-form-item>
        <el-form-item label="折扣力度" prop="percentValue" v-if="ruleForm.type == 'percent'">
          <el-input type="number" min="0" max="9.9"  v-model="ruleForm.percentValue" auto-complete="off">
            <i slot="suffix">折</i>
          </el-input>
        </el-form-item>
        <el-form-item label="使用门槛" prop="minimumOrderPrice" class="multiple-item">
          <el-radio-group v-model="threshold">
            <el-radio label="unlimited">不限</el-radio>
            <el-radio label="limited">消费金额满</el-radio>
          </el-radio-group>
          <el-input class="fr" type="number"  @blur="validateFloat($event, 'ruleForm.minimumOrderPrice')" :disabled="threshold == 'unlimited'" v-model="ruleForm.minimumOrderPrice" auto-complete="off">
            <i slot="suffix">元</i>
          </el-input>
          <div class="tips" v-show="threshold == 'unlimited'">请谨慎设置无门槛优惠券，避免资金损失</div>
        </el-form-item>
        <el-form-item label="每人限领" prop="receivedCountLimit" class="multiple-item">
          <el-radio-group v-model="limitedCount">
            <el-radio label="unlimited">不限</el-radio>
            <el-radio label="limited">限领</el-radio>
          </el-radio-group>
          <el-input type="number" class="fr" @blur="validateNumber($event, 'ruleForm.receivedCountLimit')"  :disabled="limitedCount == 'unlimited'" v-model="ruleForm.receivedCountLimit" auto-complete="off">
            <i slot="suffix">张</i>
          </el-input>
          <!-- <div class="tips" v-show="limitedCount == 'unlimited'">请谨慎设置无门槛优惠券，避免资金损失</div> -->
        </el-form-item>
        <el-form-item label="优惠券总量" prop="maxCount">
          <el-input type="number" @blur="validateNumber($event, 'ruleForm.maxCount')" v-model="ruleForm.maxCount" auto-complete="off">
            <i slot="suffix">张</i>
          </el-input>
        </el-form-item>
        <el-form-item label="有效期" prop="expiredEndStr" class="multiple-item date-item">
          <el-radio-group v-model="expiredType">
            <el-radio label="fixed">固定日期</el-radio>
            <el-radio label="range">领券当日开始</el-radio>
          </el-radio-group>
          <el-input type="number" class="fr" @blur="validateNumber($event, 'ruleForm.expiredEndStr')" :disabled="expiredType == 'fixed'" v-model="ruleForm.expiredEndStr" auto-complete="off">
            <i slot="suffix">天</i>
          </el-input>
          <div v-if="expiredType == 'fixed'" style="margin-top:10px;">
            <el-date-picker
              v-model="ruleForm.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="使用范围" prop="testVal">
          <el-radio-group v-model="useRange">
            <el-radio label="unlimited">全部商品</el-radio>
            <el-radio label="enable">指定商品可用</el-radio>
            <el-radio label="disable">指定商品不可用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="指定商品" v-show="useRange != 'unlimited'">
          <el-button @click="choiceGoods">选择商品</el-button>
          <goods-list v-show="useRange == 'enable' && enableGoodsList.length" :goodsList="enableGoodsList"></goods-list>
          <goods-list v-show="useRange == 'disable' && disableGoodsList.length" :goodsList="disableGoodsList"></goods-list>
        </el-form-item>
      </el-form>
    </div>
    <select-goods ref="selectGoods" v-if="goodsVisible" @hide="goodsVisible = false"></select-goods>
    <div class="footer-btn">
      <el-button class="save-btn" type="primary" @click="createCoupon">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getDaysLater } from '@/assets/js/utils'
import { formatDate } from '@/filters/filters'
import { mixinsValidate } from '@/assets/js/mixins.js'
import SelectGoods from '@/components/public/SelectGoods'
import GoodsList from './GoodsList'
import { mapState, mapMutations } from 'vuex'
export default {
  mixins: [mixinsValidate],
  components: {
    SelectGoods,
    GoodsList
  },
  data() {
    let validatePercent = (rule, value, callback) => {
      if (value > 9.9 || value < 1) {
        callback(new Error('请设置1.0~9.9折之间的折扣额度'))
      }
      callback()
    }
    let validateSelectGoods = (rule, value, callback) => {
      let useRange = this.useRange
      if (useRange == 'enable' && !this.enableGoodsList.length || useRange == 'disable' && !this.disableGoodsList.length) {
        callback(new Error('请选择指定商品'))
      }
      callback()
    }
    let validateMaxCount = (rule, value, callback) => {
      if (parseInt(value) > 100000 || parseInt(value) < 1) {
        callback(new Error('请输入100000以内的整数值'))
      }
      if (parseInt(value) < parseInt(this.ruleForm.receivedCountLimit) && this.limitedCount == 'limited') {
        callback(new Error('优惠券总量需大于限领数量'))
      }
      callback()
    }
    let validateLimitCount = (rule, value, callback) => {
      if (parseInt(value) > 100000 || parseInt(value) < 1) {
        callback(new Error('请输入100000以内的整数值'))
      }
      if (parseInt(value) > parseInt(this.ruleForm.maxCount) && this.limitedCount == 'limited') {
        callback(new Error('限领数量需小于优惠券总量'))
      }
      this.$refs.ruleForm.validateField('maxCount')
      callback()
    }
    let validateCommonValue = (rule, value, callback) => {
      if (parseInt(value) >= 10000000000 || value <= 0) {
        callback(new Error('请输入小数点前保留10位，小数点后保留2位的数字'))
      }
      callback()
    }
    let validateDate = (rule, value, callback) => {
      if (this.expiredType == 'fixed' && (!this.ruleForm.dateRange || !this.ruleForm.dateRange.length)) {
        callback(new Error('请选择有效期限'))
      }
      if (this.expiredType == 'range') {
        if (!value) {
          callback(new Error('请设置优惠券有效期'))
        }
        if (value < 1 || value > 365 || value.toString().indexOf('.') != -1) {
          callback(new Error('请设置1-365以内的整数值'))
        }
      }
      callback()
    }
    return {
      couponRouter: {
        path: '/coupon',
        text: '优惠券'
      },
      typeOptions: [
        {
          value: 'percent',
          label: '折扣券'
        }, {
          value: 'constant',
          label: '代金券'
        }
      ],
      goodsVisible: false,
      threshold: 'limited',
      limitedCount: 'unlimited',
      expiredType: 'fixed',
      useRange: 'unlimited',
      ruleForm: {
        displayName: '',
        type: '',
        value: '',
        percentValue: '',
        constantValue: '',
        storeId: localStorage.getItem('storeId'),
        minimumOrderPrice: '',
        maxCount: '',
        expiredStart: '',
        expiredEnd: '',
        expiredEndStr: '',
        relativeExpiredMilliseconds: '',
        receivedCountLimit: '',
        enableProducts: [],
        disableProducts: [],
        testVal: '123',
        dateRange: []
      },
      rules: {
        displayName: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' },
          { min: 1, max: 20, message: '请输入20字以内的优惠券名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择优惠券类型', trigger: 'change' }
        ],
        constantValue: [
          { required: true, message: '请输入代金券金额', trigger: 'blur' },
          { validator: validateCommonValue, trigger: 'blur' }
        ],
        percentValue: [
          { required: true, message: '请设置折扣额度', trigger: 'blur' },
          { validator: validatePercent, trigger: 'blur' }
        ],
        minimumOrderPrice: [
          { required: true, message: '请输入使用门槛金额', trigger: 'blur' },
          { validator: validateCommonValue, trigger: 'blur' }
        ],
        receivedCountLimit: [
          { required: true, message: '请输入限领数量', trigger: 'blur' },
          { validator: validateLimitCount, trigger: 'blur' }
        ],
        maxCount: [
          { required: true, message: '请设置优惠券总量', trigger: 'blur' },
          { validator: validateMaxCount, trigger: 'blur' }
        ],
        testVal: [
          { required: true },
          { validator: validateSelectGoods }
        ],
        expiredEndStr: [
          { validator: validateDate , trigger: 'blur'},
          // { required: true, message: '请设置优惠券有效期', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    threshold(newVal) {
      if (newVal == 'unlimited') {
        this.$refs.ruleForm.clearValidate('minimumOrderPrice')
      }
    },
    limitedCount(newVal) {
      if (newVal == 'unlimited') {
        this.$refs.ruleForm.clearValidate('receivedCountLimit')
      }
    },
    expiredType(newVal) {
      if (newVal == 'fixed') {
        this.$refs.ruleForm.clearValidate('receivedCountLimit')
      }
    },
    useRange(newVal) {
      this.setGoodsUseType(newVal)
      this.$refs.ruleForm.validateField('testVal')
    },
    enableGoodsList(newVal) {
      this.$refs.ruleForm.validateField('testVal')
    },
    disableGoodsList(newVal) {
      this.$refs.ruleForm.validateField('testVal')
    }
  },
  methods: {
    ...mapMutations([
      'setGoodsUseType', 'setGoodsList', 'refreshGoodsList'
    ]),
    choiceGoods() {
      this.goodsVisible = true
    },
    createCoupon() {
      let validateArr = ['displayName', 'type', 'maxCount', 'expiredEndStr', 'testVal']
      if (this.threshold == 'limited') {
        validateArr.push('minimumOrderPrice')
      } else {
        this.ruleForm.minimumOrderPrice = null
      }
      if (this.ruleForm.type == 'percent') {
        validateArr.push('percentValue')
        this.ruleForm.value = this.ruleForm.percentValue / 10
      }
      if (this.ruleForm.type == 'constant') {
        validateArr.push('constantValue')
        this.ruleForm.value = this.ruleForm.constantValue
      }
      if (this.limitedCount == 'limited') {
        validateArr.push('receivedCountLimit')
      } else {
        this.ruleForm.receivedCountLimit = null
      }
      if (this.expiredType == 'fixed') {
        if (this.ruleForm.dateRange) {
          this.ruleForm.expiredStart = formatDate(new Date(this.ruleForm.dateRange[0]))
          this.ruleForm.expiredEnd = formatDate(new Date(this.ruleForm.dateRange[1]))
        }
      } else {
        // this.ruleForm.expiredStart = new Date()
        this.ruleForm.relativeExpiredMilliseconds = 1000 * 60 * 60 * 24 * this.ruleForm.expiredEndStr
      }
      if (this.useRange == 'enable') {
        this.ruleForm.enableProducts = this.enableGoodsList.map(item => item.productId)
      }
      if (this.useRange == 'disable') {
        this.ruleForm.disableProducts = this.disableGoodsList.map(item => item.productId)
      }
      let isValid = true
      validateArr.forEach((item) => {
        this.$refs.ruleForm.validateField(item, (msg) => {
          if (msg) {
            isValid = false
          }
        })
      })
      if (isValid) {
        this.$http.post('/api/marketing/coupon/container', this.ruleForm).then((res) => {
          this.$message.success('创建成功')
          this.$router.push({
            path: '/coupon'
          })
        }).catch((err) => {
          this.loginAgain(err).then(() => {
            this.createCoupon()
          })
        })
      }
    }
  },
  mounted() {
    this.refreshGoodsList()
  },
  computed: {
    ...mapState([
      'enableGoodsList', 'disableGoodsList', 'goodsUseType'
    ])
  }
}
</script>

<style lang="scss" scoped>
.add-coupon{
  .add-coupon-header{
    padding: 30px 24px 1px 24px;
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
  .add-coupon-content{
    width: 100%;
    padding: 48px 18px 48px 48px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .el-date-editor--datetimerange{
      width: 426px;
    }
    .tips{
      color: #909399;
      font-size: 14px;
    }
    .el-input{
      width: 425px;
    }
    .el-select{
      width: 425px;
    }
    .multiple-item{
      width: 525px;
      .el-radio{
        &:last-child{
          margin-left: 100px;
        }
      }
      .el-input{
        width: 150px;
      }
    }
    .date-item{
      .el-radio{
        &:last-child{
          margin-left: 70px;
        }
      }
    }
  }
  .footer-btn{
    padding: 30px 0;
    text-align: center;
  }
}

</style>
