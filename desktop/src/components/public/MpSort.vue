<template>
  <div class="caret-box"  @click="sortFn">
    <slot></slot>
    <span class="caret-wrapper" :class="{'ascend': isAscend, 'descend': isDescend}">
      <i class="sort-caret descending"></i><i class="sort-caret ascending"></i>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    descend: {
      type: Boolean,
      default: false
    },
    hasDefault: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isAscend: false,
      isDescend: false
    }
  },
  methods: {
    sortFn() {
      let result = ''
      if (this.hasDefault) {
        if (!this.isAscend && !this.isDescend) {
          this.isAscend = true
          result = 'ascend'
        } else if (this.isAscend) {
          this.isAscend = false
          this.isDescend = true
          result = 'descend'
        } else if (this.isDescend) {
          this.isAscend = false
          this.isDescend = false
          result = ''
        }
      } else {
        this.isAscend = !this.isAscend
        this.isDescend = !this.isDescend
      }
      this.$emit('changeSort', result)
    }
  },
  mounted() {
    this.isDescend = this.descend
  }  
}
</script>

<style lang="scss">
.caret-box{
  display: inline-block;
  cursor: pointer;
  .caret-wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    height: 34px;
    width: 24px;
    vertical-align: middle;
    overflow: initial;
    position: relative;
    left: -6px;
  }
  .sort-caret {
      width: 0;
      height: 0;
      border: 5px solid transparent;
      position: absolute;
      left: 7px;
      // border-top-color: #c0c4cc;
      bottom: 7px;
  }
  .descending {
    border-top-color: #c0c4cc;
  }
  .descend{
    .descending {
      border-top-color: #409eff;
    }
  }
  .ascending {
    border-bottom-color: #c0c4cc;
    top: 5px;
  }
  .ascend{
    .ascending {
      border-bottom-color: #409eff;
    }
  }
}
</style>
