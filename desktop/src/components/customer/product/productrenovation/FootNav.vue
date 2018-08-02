<template>
  <div class="foot-nav">
    <ul>
      <li v-for="(item, index) in pageCatalog" :key="item.title"  @click="changePage(item, index)">
        <!-- {{item.title}} -->
        <img v-if="item.icon && index != pageActiveIndex" :src="item.icon">
        <img v-if="item.activeIcon && index == pageActiveIndex" :src="item.activeIcon">
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  props: {
    pageCatalog: {
      type: Array,
      default() {
        return []
      }
    },
    pageActiveIndex: [Number, String]
  },
  data() {
    return {
      
    }
  },
  methods: {
    changePage(item, index) {
      this.$emit('changePage', item, index)
    }
  },
  mounted() {
   
  }
}
</script>

<style lang="scss">
 .foot-nav{
  position: fixed;
  z-index: 1000;
  top: 606px;
  width: 264px;
  left: 706px;
  height: 40px;
  text-align: center;
  background: #f9f9f9;
  box-shadow:0 -1px 0 hsla(0,6%,58%,.6);
  ul{
    display: flex;
    li{
      flex: 1;
      font-size: 12px;
      cursor: pointer;
      img{
        width: 50px;
      }
    }
  }
}
</style>
