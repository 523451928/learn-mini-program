<template>
  <div class="mp-swiper" @click="changeComponent">
    <el-popover
      placement="top"
      width="170"
      v-model="popVisible">
      <p style="text-align: center; margin-top: 10px">确定删除轮播图组件吗？</p>
      <div style="text-align: center; margin: 10px">
        <el-button size="mini" round @click="popVisible = false">取消</el-button>
        <el-button round type="primary" size="mini" @click="deleteComponent">确定</el-button>
      </div>
      <span slot="reference" class="delete-btn">
        <span class="el-icon-delete"></span>删除
      </span>
    </el-popover>
    <mp-carousel :height="height" :imgArr="imageArr"  :duration="5000" ref="mpCarousel"></mp-carousel>
  </div>
</template>

<script>
import MpCarousel from 'components/public/MpCarousel'
import { mixins } from './mixins'
export default {
  mixins: [ mixins ],
  props: {
    imgArr: {
      type: Array,
      default() {
        return []
      }
    },
    height: [String, Number]
  },
  components: {
    MpCarousel
  },
  watch: {
    imgArr(newVal) {
      this.imageArr = newVal.map((item) => {
        if (item.url) {
          return item.url
        }
      })
      
      if (this.imageArr.length == 0) {
        this.imageArr = [require('src/assets/imgs/slider.jpg'), require('src/assets/imgs/slider.jpg'), require('src/assets/imgs/slider.jpg')]
      } else {
        this.imageArr.forEach((item) => {
          if (!item) {
            item = require('src/assets/imgs/slider.jpg')
          }
        })
      }
    }
  },
  data() {
    return {
      imageArr: [
        require('src/assets/imgs/slider.jpg')
      ],
      popVisible: false
    }
  },
  mounted() {
    if (this.imgArr.length > 0) {
      this.imageArr = this.imgArr.map((item) => {
        if (item.url) {
          return item.url
        }
      })
      if (!this.imageArr[0]) {
        this.imageArr = [require('src/assets/imgs/slider.jpg')]
      }
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
      padding: 3px 8px;
      right: 7px;
      top: 7px;
      z-index: 1000;
      display: none;
      color: #fff;
      font-size: 12px;
      border-radius: 12px;
      background: rgba(0,0,0,0.6);
    }
    &:hover{
      .delete-btn{
        display: inline-block;
      }
      border: 1px dashed #6d6d6d;
    }
  }
</style>
