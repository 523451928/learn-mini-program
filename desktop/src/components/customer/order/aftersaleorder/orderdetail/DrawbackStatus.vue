<template>
  <div class="panel-content">
    <div class="panel-head">退款状态</div>
    <div class="drawback-status">
      <p >
        <span class="drawback-status-text">当前退款状态</span>
        <span class="apply-text">申请处理中</span>
        （你还有<i>{{day}}天{{hour}}小时{{minute}}分钟</i>来对本次退款进行处理，逾时将自动通过退款申请，进入退款流程。）
      </p>
    </div>
  </div>
</template>

<script>
import { padLeftZero } from '@/assets/js/utils'
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
      day: '0',
      hour: '00',
      minute: '00'
    }
  },
  methods: {
    
  },
  computed: {
   
  },
  mounted() {
    
  },
  watch: {
    orderDetail(newVal) {
      if (newVal.cancelCreateTime) {
        let endTime = new Date(newVal.cancelCreateTime).getTime() + 24*60*60*1000*7
        this.day = parseInt((endTime - Date.now()) / 1000 / 60 / 60 / 24 , 10)
        this.hour = padLeftZero(parseInt((endTime - Date.now()) / 1000 / 60 / 60 % 24 , 10))
        this.minute = padLeftZero(parseInt((endTime - Date.now()) / 1000 / 60 % 60 , 10))
        setInterval(() => {
          this.hour = padLeftZero(parseInt((endTime - Date.now()) / 1000 / 60 / 60 % 24 , 10))
          this.minute = padLeftZero(parseInt((endTime - Date.now()) / 1000 / 60 % 60 , 10))
        }, 60000)
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
  .drawback-status{
    box-sizing: border-box;
    padding: 46px 0px 16px 66px;
    p{
      font-size: 14px;
      color: #909399;
      .drawback-status-text{
        font-size: 18px;
        color: #909399;
      }
      .apply-text{
        color: #f56c6c;
        font-size: 18px;
      }
      i{
        font-style: normal;
        color: #f56c6c;
      }
    }
  }
}
</style>
