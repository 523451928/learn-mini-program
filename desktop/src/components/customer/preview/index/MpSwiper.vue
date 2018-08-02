<template>
  <div class="mp-swiper">
    <mp-carousel :height="height" :isRemLayout="true" :hasLink="true" :imgArr="imageArr" :isDrag="true" clientType="mobile" :duration="5000" ref="mpCarousel"></mp-carousel>
  </div>
</template>

<script>
import MpCarousel from 'components/public/MpCarousel'
export default {
  props: {
    imgArr: {
      type: Array,
      default() {
        return []
      }
    },
    height: [String, Number],
    hasDeleteBtn: {
      type: Boolean,
      default: true
    }
  },
  components: {
    MpCarousel
  },
  watch: {
    imgArr(newVal) {
      this.imageArr = newVal
      if (this.imageArr.length == 0 || !this.imageArr[0]) {
        this.imageArr = [require('src/assets/imgs/slider.jpg')]
      }
    }
  },
  data() {
    return {
      imageArr: [
        {
          url: require('src/assets/imgs/slider.jpg')
        }
      ]
    }
  },
  mounted() {
    if (this.imgArr.length > 0) {
      this.imageArr = this.imgArr
    }
  }
}
</script>

<style lang="scss" scoped>
  .mp-swiper{
    position: relative;
    box-sizing: border-box;
    .delete-btn{
      display: inline-block;
      position: absolute;
      cursor: pointer;
      padding: 5px 10px;
      right: 7px;
      top: 7px;
      z-index: 1000;
      display: none;
      color: #fff;
      font-size: 12px;
      border-radius: 10px;
      background: rgba(0,0,0,0.6);
    }
  }
</style>
