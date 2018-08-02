<template>
  <div class="goodslist-wrapper">
    <div class="panel-head">
      <span>商品信息</span>
      <span>操作</span>
    </div>
    <div class="goodslist-container">
      <ul>
        <li v-for="(item, index) in goodsList" :key="item.productId">
          <span>{{item.title}}</span>
          <span :class="{'disabled': disabled}" class="link-text" @click="deleteItem(index)">删除</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapSate, mapMutations } from 'vuex'
export default {
  props: {
    goodsList: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  methods: {
    ...mapMutations([
      'setGoodsList'
    ]),
    deleteItem(index) {
      if (this.disabled) {
        return
      }
      this.goodsList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/css/mixin.scss';
.goodslist-wrapper{
  width: 425px;
  font-size: 14px;
  border: 1px solid #ebeef5;
  margin-top: 18px;
  box-sizing: border-box;
  .panel-head{
    height: 48px;
    line-height: 48px;
    background-color: #fafafa;
    color: #909399;
    border-bottom: 1px solid #ebeef5;
    span{
      display: inline-block;
      box-sizing: border-box;
      padding-left: 24px;
      width: 30%;
      &:first-child{
        width: 69%;
      }
    }
  }
  .goodslist-container{
    max-height: 240px;
    overflow-y: auto;
    @include scrollBar;
    li{
      line-height: 46px;
      height: 46px;
      border-bottom: 1px solid #ebeef5;
      &:last-child{
        border: none;
      }
      .link-text{
        color: #519ae9;
        cursor: pointer;
      }
      .disabled{
        color: #ccc;
        cursor: not-allowed;
      }
      span{
        float: left;
        box-sizing: border-box;
        padding-left: 24px;
        width: 30%;
        &:first-child{
          width: 69%;
          white-space: nowrap;
          border-right: 1px solid #ebeef5;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
