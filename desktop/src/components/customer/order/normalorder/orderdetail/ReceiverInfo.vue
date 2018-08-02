<template>
  <div class="panel-content">
    <div class="panel-head">收货人信息</div>
    <div class="panel-container">
      <div class="panel-item">
        <p class="left-p">
          <span class="label-text">收货人姓名</span><span>{{orderDetail.receiver}}</span>
        </p>
        <p class="right-p">
          <span class="label-text">收货地址</span><span>{{addressText}}</span>
        </p>
      </div>
      <div class="panel-item">
        <p class="left-p">
          <span class="label-text">联系电话</span><span>{{orderDetail.phone}}</span>
        </p>
        <p class="right-p">
          <span class="label-text">买家留言</span><span>{{orderDetail.remark}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { adMap } from '@/assets/json/area'
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
    addressText() {
      if (this.orderDetail.areaCode) {
        let addressObJ = adMap.getAddress(this.orderDetail.areaCode)
        return addressObJ.province + ' ' + addressObJ.city + ' ' + addressObJ.district + ' ' + this.orderDetail.details
      }
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
      .left-p{
        width: 506px;
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
