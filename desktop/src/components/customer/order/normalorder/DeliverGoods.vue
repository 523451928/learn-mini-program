<template>
  <div class="deliver-goods">
    <div class="deliver-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item >订单管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/deliveryorder'}">发货订单</el-breadcrumb-item>
        <el-breadcrumb-item>批量发货</el-breadcrumb-item>
      </el-breadcrumb>
      <p>批量发货</p>
    </div>
    <div class="deliver-goods-wrapper">
      <div class="panel-title">
        <span>商品信息</span>
        <span>商品价格</span>
        <span>规格</span>
        <span>件数</span>
        <span>操作</span>
      </div>
      <div class="deliver-goods-list">
        <ul v-if="pendingDeliveryOrder && pendingDeliveryOrder.length">
          <li v-for="order in pendingDeliveryOrder" :key="order.orderId">
            <div class="panel-header">
              <span class="order-number">
                订单编号： {{order.orderNumber}}  
              </span>
              <span>
                {{order.address.areaCode | formatArea}}
                {{order.details}}
                {{order.receiver}}
                {{order.phone}}
              </span>
            </div>
            <div class="panel-content">
              <div class="panel-item">
                <span v-for="(item, index) in order.orderItems" :key="index">
                  {{item.productTitle}}
                </span>
              </div>
              <div class="panel-item">
                <span v-for="(item, index) in order.orderItems" :key="index">
                  ￥{{item.unitPrice}}
                </span>
              </div>
              <div class="panel-item">
                <span v-for="(item, index) in order.orderItems" :key="index">
                  <i v-for="spec in item.specifications" :key="spec.name">
                    {{spec.name}}:{{spec.value}}
                  </i>
                </span>
              </div>
              <div class="panel-item">
                <span v-for="(item, index) in order.orderItems" :key="index">
                  <i>&times;</i> {{item.count}}
                </span>
              </div>
              <div class="panel-item">
                物流公司
                <el-input v-model="order.logisticsName"></el-input>
                &nbsp;
                物流单号
                <el-input v-model="order.logisticsNumber"></el-input>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="submit-container">
      <el-button type="primary" @click="uploadDeliver">上传</el-button>
    </div>
  </div>
</template>

<script>
import { adMap } from '@/assets/json/area'
import { trim } from '@/assets/js/utils'
export default {
  data() {
    return {
      pendingDeliveryOrder: []
    }
  },
  methods: {
    uploadDeliver() {
      let orders = this.orders
      let isValid = true
      for (let i = 0;i < orders.length;i++) {
        if (!orders[i].companyName) {
          this.$message.warning('请输入物流公司名称')
          isValid = false
          break
        }
        if (orders[i].companyName.length > 15) {
          this.$message.warning('请输入15字以内物流公司名称')
          isValid = false
          break
        }
        if (!orders[i].logisticsOrderNumber) {
          this.$message.warning('请输入物流单号')
          isValid = false
          break
        }
        if (orders[i].logisticsOrderNumber.length > 20) {
          this.$message.warning('请输入20字以内物流单号')
          isValid = false
          break
        }
      }
      if (!isValid) {
        return
      }
      this.$http.put('/api/Order/ship', {orders}).then((res) => {
        this.$message.success('上传成功!')
        this.$router.push({
          path: '/deliveryorder'
        })
      }).catch((err) => {
        // this.$message.error('上传失败，请重试!')
        this.loginAgain(err).then(() => {
          this.uploadDeliver()
        })
      })
    }
  },
  filters: {
    formatArea(areaCode) {
      if (areaCode) {
        let addressObJ = adMap.getAddress(areaCode)
        return addressObJ.province + ' ' + addressObJ.city + ' ' + addressObJ.district
      }
    }
  },
  mounted() {
    this.pendingDeliveryOrder = JSON.parse(localStorage.getItem('pendingDeliveryOrder'))
    this.pendingDeliveryOrder.forEach((item) => {
      this.$set(item, 'logisticsNumber', '')
      this.$set(item, 'logisticsName', '')
    })
  },
  computed: {
    orders() {
      return this.pendingDeliveryOrder.map((item) => {
        return {
          orderId: item.orderId,
          logisticsOrderNumber: trim(item.logisticsNumber),
          companyName: trim(item.logisticsName)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.deliver-goods{
  .submit-container{
    background: #fff;
    box-shadow: 0 3px 15px 0 rgba(0, 0, 0, 0.1);
    padding: 16px 40px;
    position: fixed;
    bottom: 0;
    left: 317px;
    right: 32px;
    text-align: center;
  }
  .deliver-header{
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
  .deliver-goods-wrapper{
    width: 100%;
    padding: 30px 20px 150px 20px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .panel-title{
      width: 100%;
      height: 48px;
      line-height: 48px;
      background-color: #fafafa;
      border: solid 1px #ebeef5;
      margin-bottom: 15px;
      span{
        width: 14%;
        text-indent: 24px;
        display: inline-block;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        color: #909399;
        &:last-child{
          width: 13%;
        }
      }
    }
    .deliver-goods-list{
      li{
        margin-bottom: 15px;
        .panel-header{
          width: 100%;
          height: 48px;
          line-height: 48px;
          background: #fafafa;
          text-indent: 24px;
          border: 1px solid #ebeef5;
          border-bottom: none;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          color: #909399;
          .order-number{
            display: inline-block;
            text-indent: 0;
            width: 14%;
          }
        }
        .panel-content{
          border: 1px solid #ebeef5;
          box-shadow: none;
          overflow: hidden;
          margin-bottom: 0;
          padding-bottom: 0;
          // font-size: 0;
          color: #4d4f53;
          .panel-item{
            width: 14%;
            text-indent: 24px;
            display: inline-block;
            position: relative;
            font-size: 14px;
            box-sizing: border-box;
            vertical-align: middle;
            &::after{
              content: '';
              position: absolute;
              width: 1px;
              height: 600px;
              background: #ebeef5;
              right: 0;
              top: -300px;
            }
            &:first-child{
              color: #303133;
            }
            &:last-child{
              .link-text{
                color: #519ae9;
                cursor: pointer;
                display: inline-block;
                border: none;
              }
              &::after{
                content: '';
                position: absolute;
                width: 1px;
                height: 0;
                background: #ebeef5;
                right: 0;
                top: -300px;
              }
            }
            span{
              display: block;
              line-height: 50px;
              height: 50px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              border-bottom: 1px solid #ebeef5;
              &:last-child{
                border-bottom: none;
              }
            }
            &:last-child{
              width: 40%;
              .el-input{
                width: 35%;
                input.el-input__inner{
                  width: 180px;
                  display: inline-block;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
