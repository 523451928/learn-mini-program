<template>
   <el-row class="tac">
    <el-menu
      :default-active="defaultIndex"
      class="el-menu-vertical-demo"
      background-color="#051a2f"
      active-background-color="#12263a"
      text-color="#bedfff"
      active-text-color="#fff">
      <a :href="defaultIndex != 1 ? '../customer/home.html': 'javascript:void(0)'">
        <el-menu-item index="1">
          <i class="icon-mpmall">&#xe695;</i>
          <span slot="title">首页</span>
        </el-menu-item>
      </a>
      <a v-if="hasProduct" :href="defaultIndex != 2 ? '../customer/product.html': 'javascript:void(0)'">
        <el-menu-item index="2">
          <i class="icon-mpmall">&#xe691;</i>
          <span slot="title">店铺</span>
        </el-menu-item>
      </a>
      <a v-if="hasManagegoods " :href="defaultIndex != 3 ? '../customer/managegoods.html': 'javascript:void(0)'">
        <el-menu-item index="3">
          <i class="icon-mpmall">&#xe694;</i>
          <span slot="title">商品</span>
        </el-menu-item>
      </a>
      <a v-if="hasOrder" href="../customer/order.html">
        <el-menu-item index="4">
          <i class="icon-mpmall">&#xe692;</i>
          <span slot="title">订单</span>
        </el-menu-item>
      </a>
      <a v-if="hasMarketing" href="../customer/marketing.html">
        <el-menu-item index="6">
          <i class="icon-mpmall">&#xe693;</i>
          <span slot="title">营销</span>
        </el-menu-item>
      </a>
      <a v-if="hasSetting" :href="defaultIndex != 5 ? '../customer/setting.html': 'javascript:void(0)'">
        <el-menu-item index="5">
          <i class="icon-mpmall">&#xe697;</i>
          <span slot="title">设置</span>
        </el-menu-item>
        </a>
    </el-menu>
  </el-row>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    defaultIndex: {
      type: String,
      default: '1'
    },
    permissions: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    hasProduct() {
      if (this.permissions.includes('StoreFacade')) {
        return true
      } else {
        return false
      }
    },
    hasManagegoods() {
      if (this.permissions.includes('Product') || this.permissions.includes('ProductGroup')) {
        return true
      } else {
        return false
      }
    },
    hasOrder() {
      if (this.permissions.includes('Order')) {
        return true
      } else {
        return false
      }
    },
    hasMarketing() {
      if (this.permissions.includes('Coupon')) {
        return true
      } else {
        return false
      }
    },
    hasSetting() {
      if (this.permissions.includes('MiniAppAuthorize') || this.permissions.includes('MiniAppAudit') 
            || this.permissions.includes('PaymentConfiguration') || this.permissions.includes('ForwardSetting')
              || this.permissions.includes('FreightTemplate') || this.permissions.includes('CustomerSetting')) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tac{
  .icon-mpmall{
    font-size: 18px;
    color: #87a0bb;
  }
}
</style>
