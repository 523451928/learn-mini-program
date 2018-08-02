<template>
  <div class="bouncing-loader" :class="{'visible' : loadVisible}">
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script>
export default {
  props: {
    loadVisible: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss">
  @keyframes bouncing-loader {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0.1;
      transform: translateY(-10rpx);
    }
  }
  .bouncing-loader {
    display: flex;
    justify-content: center;
    visibility: hidden;
  }
  .visible{
    visibility: visible;
  }
  .bouncing-loader > div {
    width: 10rpx;
    height: 10rpx;
    margin: 30rpx 2rpx;
    background: #8385aa;
    border-radius: 50%;
    animation: bouncing-loader 0.6s infinite alternate;
  }
  .bouncing-loader > div:nth-child(2) {
    animation-delay: 0.2s;
  }
  .bouncing-loader > div:nth-child(3) {
    animation-delay: 0.4s;
  }
</style>
