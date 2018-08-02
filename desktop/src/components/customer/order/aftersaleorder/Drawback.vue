<template>
  <div class="drawback-detail">
    <div class="detail-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item >订单管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="orderRouter">{{orderRouter.text}}</el-breadcrumb-item>
        <el-breadcrumb-item>处理退款</el-breadcrumb-item>
      </el-breadcrumb>
      <p>处理退款</p>
    </div>
    <drawback-status :orderDetail="orderDetail"></drawback-status>
    <drawback-info :orderDetail="orderDetail"></drawback-info>
    <div class="footer-btns">
      <el-button @click="refuseDrawback">拒绝退款申请</el-button>
      <el-button @click="agreeDrawback" type="primary">同意退款申请</el-button>
    </div>
    <el-dialog
        title="拒绝退款"
        :visible.sync="dialogVisible"
        top="32vh"
        width="466px"
        center>
        <div class="form-group">
          <el-input
            type="textarea"
            maxlength="100"
            :rows="3"
            placeholder="请填写拒绝退款申请的理由"
            v-model="reason">
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="mp-large-btn" @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" class="mp-large-btn" @click="confirmRefuseDrawback">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import DrawbackInfo from './orderdetail/DrawbackInfo'
import DrawbackStatus from './orderdetail/DrawbackStatus'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    DrawbackInfo,
    DrawbackStatus
  },
  data() {
    return {
      orderDetail: {},
      orderRouter: {
        path: '/aftersaleorder',
        text: '售后订单'
      },
      orderId: '',
      reason: '',
      dialogVisible: false
    }
  },
  methods: {
    ...mapMutations([
      'setAppId'
    ]),
    confirmRefuseDrawback() {
      if (!this.reason) {
        this.$message.warning('请填写原因')
        return
      }
      this.$http.put("/api/Order/cancellation/aborted", {
        orderId: this.orderId,
        reason: this.reason
      }).then((res) => {
        this.dialogVisible = false
        this.$router.push({
          path: '/aftersaleorder'
        })
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.agreeDrawback()
        })
        if (err.response.status != 401) {
          this.$message.warning('用户已取消退款申请')
          this.$router.push({
            path: '/aftersaleorder'
          })
        }
      })
    },
    refuseDrawback() {
      this.dialogVisible = true
    },
    agreeDrawback() {
      this.$confirm("确认退款后不可撤销，系统将按照退款规则在1~3个工作日内将退款金额原路退回到买家账号。", "确认退款", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true
      }).then(() => {
        this.$http.put("/api/Order/cancellation/canceled", {
          orderId: this.orderId
        }).then((res) => {
          this.$http.post("/api/wechat/payment/refund/order" ,{
            orderId: this.orderId,
            price: this.orderDetail.totalPrice
          }).then((response) => {
            this.$router.push({
              path: '/aftersaleorder'
            })
          }).catch((err) => {
            if (err.response.status == 400 && err.response.data.error.code == 40888 && err.response.data.error.message == 'NOTENOUGH') {
              this.$alert("微信支付可用余额不足，请前往'商户平台'充值后在手动退款" , "余额不足", {
                confirmButtonText: '确定',
                center: true
              }).then((res) => {

              })
            }
          })
        }).catch((err) => {
          this.loginAgain(err).then(() => {
            this.agreeDrawback()
          })
          if (err.response.status != 401) {
            this.$message.warning('用户已取消退款申请')
            this.$router.push({
              path: '/aftersaleorder'
            })
          }
        })
      })
    },
    getOrderDetail(id) {
      this.$http.get(`/api/Order/${id}`).then((res) => {
        this.orderDetail = res.data.data
        if (!this.appId) {
          this.$http.get('/api/wechat/miniapp', {
            params: {
              storeId: localStorage.getItem('storeId')
            }
          }).then((res) => {
            this.setAppId(res.data.data.appId)
            this.getPaymentOrder(this.appId, this.orderDetail.orderNumber)
          })
        } else {
          this.getPaymentOrder(this.appId, this.orderDetail.orderNumber)
        }
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getOrderDetail(id)
        })
      })
    },
    getPaymentOrder(appId, orderNumber) {
      this.$http.get('/api/wechat/payment/order', {params: {
        appId,
        orderNumber
      }}).then((res) => {
        if (res.data.data.status == 'SUCCESS') {
          let reg = new RegExp( '-' , "g" )
          this.orderDetail = {...this.orderDetail, ...res.data.data}
          this.orderDetail.paidTime = this.orderDetail.paidTime.replace(reg, '/')
        }
      })
    }
  },
  computed: {
    ...mapState([
      'appId'
    ])
  },
  mounted() {
    let orderId = this.$router.currentRoute.query.orderid
    this.orderId = orderId
    this.getOrderDetail(orderId)
  }
}
</script>

<style lang="scss">
.drawback-detail{
  .footer-btns{
    text-align: center;
    padding-bottom: 50px;
  }
  .detail-header{
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
}
</style>