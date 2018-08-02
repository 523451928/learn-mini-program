<template>
  <div class="home">
    <component class="component-item" v-for="(item, index) in customComponetList" 
        :index="index" :is="item.name" :key="index" :itemData="item" 
        :couponList="item.couponList"
        :imgArr="item.imgArr" :height="item.height"
        :categoryList="item.categoryList"
        :goodsObj="item.goodsObj"
       ></component>
    <div class="copyright">
      <p>由友店提供技术支持</p>
      <img src="../../../../assets/imgs/gray-logo.png" alt="">
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { mixin as components } from './components.js'

export default {
  mixins: [{
    components: components
  }],
  data() {
    return {
      customComponetList: []
    }
  },
  methods: {
    ...mapMutations([
      'setNavBar'
    ])
  },
  mounted() {
  },
  watch: {
    configuration(newVal) {
      console.log(newVal)
      this.customComponetList = newVal.customComponetList
    }
  },
  computed: {
    ...mapState([
      'configuration'
    ])
  },
  mounted() {
    this.customComponetList = this.configuration.customComponetList
    this.setNavBar(true)
    document.title = localStorage.getItem('storeName')
  }
}
</script>

<style lang="scss" scoped>
.home{
  font-size: 0.28rem;
  padding-bottom: 50px;
  background: #f5f5f5;
  min-height: 100%;
  box-sizing: border-box;
  .component-item{
    margin-bottom: 0;
    &:hover{
      border: none;
    }
  }
  .copyright{
    text-align: center;
    padding: .20rem 0 .40rem 0;
    p{
      font-size: .24rem;
      color: #ccc;
    }
    img{
      width: .7rem;
      height: .42rem;
      margin-top: .15rem;
    }
  }
}
</style>
