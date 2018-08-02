<template>
  <div class="panel-content">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>微信配置</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/payconfig' }">支付配置</el-breadcrumb-item>
      <el-breadcrumb-item>填写支付配置</el-breadcrumb-item>
    </el-breadcrumb>
    <p>填写支付配置</p>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    configRuleForm: {
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
    
  }
}
</script>

<style lang="scss">
.panel-content{
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  background: #fff;
  margin-bottom: 24px;
  padding-bottom: 30px;
  .el-icon-question{
    color: #cccccc;
  }
  .panel-head{
    line-height: 50px;
    text-indent: 25px;
    border-bottom: 1px solid #ebeef5;
  }
  .el-input{
    width: 90%;
    margin-right: 10px;
  }
  .pay-ruleForm{
    width: 520px;
    // margin: 48px auto 0 auto;
    margin-left: 115px !important;
  }
}
</style>
