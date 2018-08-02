<template>
  <div class="category-container">
    <component v-if="classifyName" :is="classifyName"></component>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mixin as components } from './components.js'
export default {
  mixins: [{
    components: components
  }],
  data () {
    return {
      categoryList: [],
      activeIndex: 0,
      classifyName: 'MpClassifyA',
      defaultImg: require('@/assets/imgs/category-active.png')
    }
  },
  methods: {
    fillBack(configuration) {
      if (configuration.classifyType == 'SettingClassifyB') {
        this.categoryList =  configuration.classifyListB
        this.classifyName = 'MpClassifyB'
      } else if (configuration.classifyType == 'SettingClassifyA') {
        this.categoryList =  configuration.classifyListA
        this.classifyName = 'MpClassifyA'
      }
    }
  },
  computed: {
    ...mapState([
      'configuration'
    ])
  },
  watch: {
    configuration(newVal) {
     this.fillBack(newVal)
    }
  },
  mounted() {
    this.fillBack(this.configuration)
    document.title = localStorage.getItem('storeName')
  }
}
</script>

<style scoped lang="scss">
.category-container{
  &:hover{
    border: none;
  }
}
</style>
