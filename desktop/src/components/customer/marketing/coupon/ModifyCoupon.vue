<template>
  <div class="add-coupon">
    <div class="add-coupon-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item >营销工具</el-breadcrumb-item>
        <el-breadcrumb-item :to="couponRouter">{{couponRouter.text}}</el-breadcrumb-item>
        <el-breadcrumb-item>编辑优惠券</el-breadcrumb-item>
      </el-breadcrumb>
      <p>编辑优惠券</p>
    </div>
    <div class="add-coupon-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="coupon-ruleForm">
        <el-form-item label="优惠券名称" prop="displayName">
          <el-input type="text" v-model="ruleForm.displayName" auto-complete="off" placeholder="20字以内">
          </el-input>
        </el-form-item>
        <el-form-item label="优惠类型" prop="type">
          <el-select v-model="ruleForm.type" placeholder="选择类型" >
            <el-option
              v-for="item in typeOptions"
              :disabled="true"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="减免金额" prop="constantValue" v-if="ruleForm.type == 'Constant'">
          <el-input type="number" :disabled="true" v-model="ruleForm.constantValue" auto-complete="off">
            <i slot="suffix">元</i>
          </el-input>
        </el-form-item>
        <el-form-item label="折扣力度" prop="percentValue" v-if="ruleForm.type == 'Percent'">
          <el-input type="number" min="0" max="9.9" :disabled="true" v-model="ruleForm.percentValue" auto-complete="off">
            <i slot="suffix">折</i>
          </el-input>
        </el-form-item>
        <el-form-item label="使用门槛" prop="minimumOrderPrice" class="multiple-item">
          <el-radio-group v-model="threshold">
            <el-radio label="unlimited" :disabled="true">不限</el-radio>
            <el-radio label="limited" :disabled="true">消费金额满</el-radio>
          </el-radio-group>
          <el-input type="number" class="fr" :disabled="true" v-model="ruleForm.minimumOrderPrice" auto-complete="off">
            <i slot="suffix">元</i>
          </el-input>
          <div class="tips" v-show="threshold == 'unlimited'">请谨慎设置无门槛优惠券，避免资金损失</div>
        </el-form-item>
        <el-form-item label="每人限领" prop="receivedCountLimit" class="multiple-item">
          <el-radio-group v-model="limitedCount">
            <el-radio label="unlimited" :disabled="true">不限</el-radio>
            <el-radio label="limited" :disabled="true">限领</el-radio>
          </el-radio-group>
          <el-input type="number" class="fr" :disabled="true" v-model="ruleForm.receivedCountLimit" auto-complete="off">
            <i slot="suffix">张</i>
          </el-input>
          <!-- <div class="tips" v-show="limitedCount == 'unlimited'">请谨慎设置无门槛优惠券，避免资金损失</div> -->
        </el-form-item>
        <el-form-item label="优惠券总量" prop="maxCount">
          <el-input type="number" v-model="ruleForm.maxCount" auto-complete="off">
            <i slot="suffix">张</i>
          </el-input>
        </el-form-item>
        <el-form-item label="有效期" prop="expiredEndStr" class="multiple-item date-item">
          <el-radio-group v-model="expiredType" :disabled="true">
            <el-radio label="fixed">固定日期</el-radio>
            <el-radio label="range">领券当日开始</el-radio>
          </el-radio-group>
          <el-input type="number" class="fr" :disabled="true" v-model="ruleForm.expiredEndStr" auto-complete="off">
            <i slot="suffix">天</i>
          </el-input>
          <div v-if="expiredType == 'fixed'" style="margin-top:10px;">
            <el-date-picker
              v-model="ruleForm.dateRange"
              :disabled="true"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="使用范围">
          <el-radio-group v-model="useRange">
            <el-radio label="unlimited" :disabled="true">全部商品</el-radio>
            <el-radio label="enable" :disabled="true">指定商品可用</el-radio>
            <el-radio label="disable" :disabled="true">指定商品不可用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="指定商品" v-show="useRange != 'unlimited'">
          <el-button @click="choiceGoods" :disabled="true">选择商品</el-button>
          <goods-list v-loading="loading" v-show="useRange == 'enable' && enableGoodsList.length" :goodsList="enableGoodsList" :disabled="true"></goods-list>
          <goods-list v-loading="loading" v-show="useRange == 'disable' && disableGoodsList.length" :goodsList="disableGoodsList" :disabled="true"></goods-list>
        </el-form-item>
      </el-form>
    </div>
    <select-goods ref="selectGoods" v-if="goodsVisible" @hide="goodsVisible = false"></select-goods>
    <div class="footer-btn">
      <el-button class="save-btn" type="primary" @click="modifyCoupon">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getDaysLater } from '@/assets/js/utils'
import SelectGoods from '@/components/public/SelectGoods'
import GoodsList from './GoodsList'
import { mapState, mapMutations } from 'vuex'
export default {
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
    let validateDate = (rule, value, callback) => {
      if (this.expiredType == 'fixed' && (!this.ruleForm.dateRange || !this.ruleForm.dateRange.length)) {
        callback(new Error('请选择有限期限'))
      }
      if (this.expiredType == 'range') {
        if (!value) {
          callback(new Error('请设置优惠券有效期'))
        }
        if (value < 1 || value > 365) {
          callback(new Error('请设置1-365以内的整数值'))
        }
      }
      callback()
    }
    let validateMaxCount = (rule, value, callback) => {
      if (value > 100000) {
        callback(new Error('请输入100000以内的整数值'))
      } else if (value < this.ruleForm.totalCount - this.ruleForm.availableCount) {
        callback(new Error('优惠券的总量需大于当前已领取的数量'))
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
          value: 'Percent',
          label: '折扣券'
        }, {
          value: 'Constant',
          label: '代金券'
        }
      ],
      loading: false,
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
          { required: true, message: '请输入代金券金额', trigger: 'blur' }
        ],
        percentValue: [
          { required: true, message: '请设置折扣额度', trigger: 'blur' },
          { validator: validatePercent, trigger: 'blur' }
        ],
        minimumOrderPrice: [
          { required: true, message: '请输入使用门槛金额', trigger: 'blur' }
        ],
        receivedCountLimit: [
          { required: true, message: '请输入限领数量', trigger: 'blur' }
        ],
        maxCount: [
          { required: true, message: '请设置优惠券总量', trigger: 'blur' },
          { validator: validateMaxCount, trigger: 'blur' }
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
    }
  },
  methods: {
    ...mapMutations([
      'setGoodsUseType', 'setGoodsList'
    ]),
    getList(list) {
      let productList = []
      let promise = Promise.resolve(productList)
      this.isLoadmore = true
      list.forEach(item => {
        promise = promise.then(() => {
          return new Promise((resolve => {
            this.$http.get(`/api/product?id=${item}`, {
              headers: {
                'Cache-Control':'public,max-age=60'
              }
            }).then((res) => {
              resolve()
              let data = res.data.data
              productList.push(data)
            })
          }))
        })
      })
      this.setGoodsList(productList)
      return promise
    },
    getCouponDetail(id) {
      this.$http.get(`/api/marketing/coupon/container/${id}`).then((res) => {
        let data = res.data.data
        this.ruleForm = data
        this.ruleForm.maxCount = data.totalCount
        if (data.type == 'Percent') {
          this.ruleForm.percentValue = data.value * 10
        } else {
          this.ruleForm.constantValue = data.value
        }
        if (!data.userReceivedCountLimit) {
          this.limitedCount = 'unlimited'
        } else {
          this.limitedCount = 'limited'
          this.ruleForm.receivedCountLimit = data.userReceivedCountLimit
        }
        if (!data.minimumOrderPrice) {
          this.threshold = 'unlimited'
        }
        if (data.relativeExpiredMilliseconds) {
          this.expiredType = 'range'
          this.ruleForm.expiredEndStr = data.relativeExpiredMilliseconds / (1000 * 60 * 60 * 24)
        } else {
          this.ruleForm.dateRange = [data.rangeExpired.start, data.rangeExpired.end]
        }
        if (data.disableProducts.length) {
          this.useRange = 'disable'
          this.setGoodsUseType('disable')
          this.getList(data.disableProducts).then(() => {
            this.loading = false
          })
        } else if (data.enableProducts.length) {
          this.useRange = 'enable'
          this.setGoodsUseType('enable')
          this.getList(data.enableProducts).then(() => {
            this.loading = false
          })
        }
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getCouponDetail(id)
        })
      })
    },
    choiceGoods() {
      this.goodsVisible = true
    },
    modifyCoupon() {
      let validateArr = ['displayName', 'maxCount']
      let isValid = true
      validateArr.forEach((item) => {
        this.$refs.ruleForm.validateField(item, (msg) => {
          if (msg) {
            isValid = false
          }
        })
      })
      if (isValid) {
        this.$http.put('/api/marketing/coupon/container/info', {
          couponContainerId: this.ruleForm.couponContainerId,
          maxCount: this.ruleForm.maxCount,
          displayName: this.ruleForm.displayName
        }).then((res) => {
          this.$message.success('编辑成功')
          this.$router.push({
            path: '/coupon'
          })
        }).catch((err) => {
          this.loginAgain(err).then(() => {
            this.modifyCoupon()
          })
        })
      }
    }
  },
  mounted() {
    let couponId = this.$router.currentRoute.query.couponid
    this.getCouponDetail(couponId)
  },
  computed: {
    ...mapState([
      'enableGoodsList', 'disableGoodsList', 'goodsUseType'
    ])
  }
}
</script>

<style lang="scss">
.add-coupon{
  .el-input__suffix{
    right: 15px;
  }
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
