<template>
  <div>
      轮播图{{imgArr}}
  </div>
</template>

<script>
import MpCarousel from '../public/MpCarousel'
export default {
  props: {
    height: [Number, String],
    imgArr: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    MpCarousel
  },
  mounted() {
  },
  watch: {
    imgArr(newVal) {
      console.log(newVal)
    }
  }
}
</script>

<style lang="scss">

</style>