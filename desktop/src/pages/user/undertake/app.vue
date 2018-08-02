<template>
  <div class="p-undertake">
    <top-header class="top-header"></top-header>
    <div class="undertake-content">
      <div class="undertake-panel">
        <div class="content">
          <h3 class="title">HI, 欢迎来到友店</h3>
          <p>订购平台服务套餐后将自动开通账号服务</p>
          <el-button type="primary" size="medium" @click.native="pay">立即订购</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopHeader from '@/components/public/TopHeader'
export default {
  components: {
    TopHeader
  },
  methods: {
    pay() {
      this.$alert('咨询电话: 0571-123456', '订购服务', {
        center: true,
        callback: action => {
          
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/css/variables.scss';
@import '~@/assets/css/mixin.scss';
.p-undertake {
  min-height: 100vh;
  background-color: $c-nc-3;
  .undertake-content {
    padding: 22px 24px 0;
    .undertake-panel {
      position: relative;
      height: 470px;
      background: $c-nc-1;
      box-shadow: 0px 4px 9px 0px rgba(65, 57, 57, 0.08);
      text-align: center;
      &::before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background: url('../../../assets/imgs/undertake/bg-1.png') no-repeat;
        background-size: 80%;
        background-position: center 0;
      }
      >.content {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .title {
          margin-bottom: 40px;
          color: $blue-color;
          font-size: 40px;
          text-align: center;
        }
        > p {
          margin-bottom: 80px;
          text-align: center;
          font-size: 26px;
          color: $routine-text-color;
        }
      }
    }
  }
}
</style>
