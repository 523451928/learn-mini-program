<template>
  <div class="panel-content">
    <div class="panel-head">退款信息</div>
    <div class="panel-container">
      <div class="panel-item">
        <p class="left-p">
          <span class="label-text">订单编号</span><span>{{orderDetail.orderNumber}}</span>
        </p>
        <p class="right-p">
          <span class="label-text">退款商品</span><span class="info-text">{{drawbackGoods}}</span>
        </p>
      </div>
      <div class="panel-item">
        <p class="left-p">
          <span class="label-text">支付单号</span><span>{{orderDetail.paymentOrderNumber ? orderDetail.paymentOrderNumber : '--'}}</span>
        </p>
        <p class="right-p">
          <span class="label-text">退款金额</span><span>{{orderDetail.totalPrice}}</span>
        </p>
      </div>
      <div class="panel-item">
        <p class="left-p">
          <span class="label-text">收货人姓名</span><span>{{orderDetail.receiver}}</span>
        </p>
        <p class="right-p">
          <span class="label-text">退款说明</span><span>{{orderDetail.cancelReason}}</span>
        </p>
      </div>
      <div class="panel-item">
        <p class="left-p">
          <span class="label-text">退款方式</span><span>仅退款</span>
        </p>
      </div>
      <div class="panel-item">
        <p class="left-p">
          <span class="label-text">申请时间</span><span>{{orderDetail.cancelCreateTime | formatDate}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/filters/filters'
export default {
  props: {
    orderDetail: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      
    }
  },
  methods: {
    
  },
  computed: {
    drawbackGoods() {
      if (this.orderDetail.items) {
        return this.orderDetail.items.map((item) => {
          return item.productName
        }).join('/')
      }
    }
  },
  filters: {
    formatDate
  }
}
</script>

<style lang="scss">
.panel-content{
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  background: #fff;
  margin-bottom: 24px;
  padding-bottom: 30px;
  .panel-head{
    line-height: 50px;
    text-indent: 25px;
    border-bottom: 1px solid #ebeef5;
  }
  .panel-container{
    box-sizing: border-box;
    padding-top: 50px;
    .panel-item{
      margin-bottom: 34px;
      p{
        color: #303133;
        font-size: 14px;
        display: inline-block;
      }
      .left-p{
        width: 506px;
        vertical-align: top;
        .label-text{
          display: inline-block;
          width: 175px;
          margin-right: 24px;
          text-align: right;
          color: #909399;
        }
      }
      .right-p{
        .label-text{
          display: inline-block;
          vertical-align: top;
          margin-right: 24px;
          color: #909399;
        }
        .info-text{
          display: inline-block;
          width: 80%;

        }
      }
    }
  }
}
</style>
