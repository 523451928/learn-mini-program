<template>
  <div class="num-wrap fr">
    <span class="minus" :class="{'minus-disable': count == 1 || count === 0}" @click="minusFn"></span>
    <input type="number" v-model="count" :disabled="disabled" @change="changeCount"/>
    <span class="plus" @click="plusFn" :class="{'plus-disable': count >= maxCount && maxCount!== ''}"></span>
  </div>
</template>

<script>
export default {
  props: {
    count: [String, Number],
    maxCount: [String, Number],
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    minusFn() {
      if (this.count == 1 || this.count == 0) {
        return
      }
      this.$emit('minusFn')
    },
    plusFn() {
      if (this.count >= this.maxCount) {
        return
      }
      this.$emit('plusFn')
    },
    changeCount() {
      if (this.count > this.maxCount) {
        this.count = this.maxCount
      }
      if (this.count <= 0) {
        this.count = 1
      }
      this.$emit('changeItem')
      this.$emit('changeCount', this.count)
    }
  }
}
</script>

<style lang="scss">
 .num-wrap{
  position: relative;
  display: flex;
  top: 30rpx;
  span{
    position:relative;
    display:inline-block;
    width:48rpx;
    height:48rpx;
    border-radius:50%;
    background:#f0f0f0;
    border:20rpx solid #fff;
    top:-15rpx;
  }
  input{
    width: 52rpx;
    display: inline-block;
    text-align: center;
    line-height: 24px;
    font-size: 26rpx;
    margin-top: 4rpx;
  }
  .minus{
    &::after{
      content: "";
      position: absolute;
      width: 12px;
      height: 2px;
      background: #666;
      border-radius: 2px;
      left: 50%;
      top: 50%;
      margin-top: -1px;
      margin-left: -6px;
    }
  }
  .plus{
    &::after{
      content: "";
      position: absolute;
      width: 12px;
      height: 2px;
      background: #666;
      border-radius: 2px;
      left: 50%;
      top: 50%;
      margin-top: -1px;
      margin-left: -6px;
    }
    &::before{
      content: "";
      position: absolute;
      background: #666;
      border-radius: 2px;
      left: 50%;
      width: 2px;
      height: 12px;
      top: 50%;
      margin-top: -6px;
      margin-left: -1rpx;
    }
  }
  .minus-disable{
    &::after{
      background: #ccc;
    }
  }
  .plus-disable{
    &::after{
      background: #ccc;
    }
    &::before{
      background: #ccc;
    }
  }
}
</style>
