<template>
  <div class="panel-content">
    <div class="panel-head">物流信息</div>
    <div class="panel-container">
      <div class="panel-item">
        <p class="left-p">
          <span class="label-text">物流公司名称</span><span>{{logisticsDetail.companyName}}</span>
        </p>
        <p class="right-p">
          <span class="label-text">物流单号</span><span>{{logisticsDetail.orderNumber}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
    ...mapState([
      'logisticsDetail'
    ])
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
          margin-right: 24px;
          color: #909399;
        }
      }
    }
  }
}
</style>
