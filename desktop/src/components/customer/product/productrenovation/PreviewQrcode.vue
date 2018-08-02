<template>
  <transition name="fade">
    <div class="qrcode-mask" v-show="qrcodeVisible" @click="hide">
      <div class="qrcode-container" @click.stop>
        <p>微信"扫一扫",预览小程序</p>
        <div class="qrcode" id="qrcode" style="width:182px; height:180px;"></div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
  },
  data () {
    return {
      qrcodeVisible: false
    }
  },
  methods: {
    show() {
      this.qrcodeVisible = true
    },
    hide() {
      this.qrcodeVisible = false
    }
  }
}
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.qrcode-container{
  transition: all .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  .qrcode-container{
    transform: scale(.8);
  }
}
.qrcode-mask{
  position: fixed;
  background: rgba(0, 0, 0, .4);
  z-index: 1000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  .qrcode-container{
    width: 266px;
    height: 286px;
    background: #fff;
    position: absolute;
    left: 50%;
    margin-left: -133px;
    top: 50%;
    margin-top: -143px;
    border-radius: 6px;
    text-align: center;
    color: #313232;
    p {
      margin: 30px 0 16px 0;
    }
    .qrcode{
      margin: 0 auto;
      padding: 10px;
      box-sizing: border-box;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      width: 180px;
      height: 180px;
      img{
        margin: 0 auto;
        display: block;
      }
    }
  }
}
</style>

