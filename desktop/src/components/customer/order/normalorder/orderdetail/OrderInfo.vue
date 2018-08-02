<template>
  <div class="panel-content">
    <div class="panel-head">订单信息</div>
    <div class="panel-container">
      <div class="panel-item">
        <p class="left-p">
          <span class="label-text">订单编号</span><span>{{orderDetail.orderNumber}}</span>
        </p>
        <p class="right-p">
          <span class="label-text">订单状态</span><span>{{orderStatusText}}</span>
        </p>
      </div>
      <div class="panel-item">
        <p class="left-p">
          <span class="label-text">支付单号</span><span>{{orderDetail.paymentOrderNumber ? orderDetail.paymentOrderNumber : '--'}}</span>
        </p>
        <p class="right-p">
          <span class="label-text">下单时间</span><span>{{orderDetail.createTime | formatDate}}</span>
        </p>
      </div>
      <div class="panel-item">
        <p class="left-p">
          <span class="label-text">支付时间</span><span>{{orderDetail.paidTime ? orderDetail.paidTime : '--'}}</span>
        </p>
        <p class="right-p">
          <span class="label-text">发货时间</span><span>{{logisticsDetail.createTime ? logisticsDetail.createTime : '--'}}</span>
        </p>
      </div>
      <div class="panel-item">
        <p class="left-p" v-if="orderStatusText != '已关闭'">
          <span  class="label-text">完成时间</span><span>{{orderDetail.completeTime ? orderDetail.completeTime : '--'}}</span>
        </p>
        <p v-else class="left-p">
          <span class="label-text">关闭时间</span><span>{{orderDetail.refundSuccessTime ? orderDetail.refundSuccessTime : '--'}}</span>
        </p>
      </div>
      <div class="panel-item">
        <div class="goods-info">
          <span class="label-text">商品信息</span>
          <div class="goods-list">
            <table>
              <thead>
                <tr>
                  <td width="55%">商品</td>
                  <td width="15%">规格</td>
                  <td width="15%">数量</td>
                  <td width="15%">商品价格</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in orderDetail.items" :key="index">
                  <td>
                    <div class="img-box">
                      <img v-lazy="item.skuPictureUri || item.productPictureUris[0]">
                      <span>{{item.productName}}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span v-for="(spec, idx) in item.specifications" :key="idx">
                        {{spec.name}}:{{spec.value}}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span class="count"> <span>&times;</span> {{item.units}}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span class="price">￥{{item.unitPrice}}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="total-price">
              <span class="fr">
                <span style="color: #303133;">实付款</span>
                <span class="money">￥{{orderDetail.totalPrice}}</span>
                <span style="color: #606266;">(包含运费￥{{orderDetail.freight}})</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/filters/filters'
import { mapMutations } from 'vuex'
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
      logisticsDetail: {}
    }
  },
  methods: {
    ...mapMutations([
      'setLogisticsDetail'
    ])
  },
  watch: {
    orderDetail(newVal) {
      if (newVal.completeTime) {
        newVal.completeTime = formatDate(newVal.completeTime)
      }
      if (!this.logisticsDetail.createTime && (newVal.status == 4 || newVal.status == 'REFUND' || newVal.status == 7 || newVal.status == 5) && this.orderStatusText != '售后处理中') {
        this.$http.get('/api/Order/logistics', {
          params: {
            orderNumber: newVal.orderNumber
          }
        }).then((res) => {
          console.log(res)
          this.logisticsDetail = res.data.data
          this.setLogisticsDetail(this.logisticsDetail)
          this.logisticsDetail.createTime = formatDate(this.logisticsDetail.createTime)
        }).catch((err) => {
          
        })
      }
    }
  },
  filters: {
    formatDate
  },
  computed: {
    orderStatusText() {
      let text
      let status = this.orderDetail.status
      if (status) {
        switch (status) {
          case 0:
          case 1:
          case 2:
            text = '待付款'
            break;
          case 3:
            text = '待发货'
            break;
          case 4:
            text = '已发货'
            break;  
          case 5:
          case 6:
            if (this.orderDetail.paymentMethod != null) {
              switch (this.orderDetail.cancelStatus) {
                case 0:
                  text = '售后处理中'
                  break
                case 1:
                case 2:
                case 3:
                  text = '已关闭'
                  break
                default:
                  text = '已关闭'
                  break
              }
            } else {
              text = '已关闭'
            }
            break;
          case 7:
            text = '已完成'
            break;  
          default:
            break;
        }        
      }
      return text
    }
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
      .goods-info{
        font-size: 14px;
        .label-text{
          display: inline-block;
          width: 175px;
          margin-right: 24px;
          text-align: right;
          color: #909399;
          vertical-align: top;
        }
        .goods-list{
          width: 60%;
          display: inline-block;
          margin-bottom: 0;
          table{
            width: 100%;
            td{
              box-sizing: border-box;
              padding-left: 24px;
            }
            thead{
              line-height: 48px;
              background-color: #fafafa;
              color: #909399;
              box-sizing: border-box;
              border: 1px solid #ebeef5;
            }
            tbody{
              td{
                border: 1px solid #ebeef5;
                vertical-align: middle;
                color: #4d4f53;
                padding: 24px;
                .img-box{
                  img{
                    width: 80px;
                    height: 80px;
                    display: inline-block;
                  }
                  span{
                    width: 80%;
                    display: inline-block;
                    vertical-align: top;
                    line-height: 24px;
                    color: #303133;
                  }
                }
              }
            }
          }
          .total-price{
            font-size: 14px;
            margin-top: 20px;
            .money{
              font-size: 18px;
              color: #f56c6c;
            }
          }
        }
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
          margin-right: 24px;
          color: #909399;
        }
      }
    }
  }
}
</style>
