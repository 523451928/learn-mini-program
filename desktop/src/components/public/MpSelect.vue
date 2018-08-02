<template>
  <div class="mp-select" @click.stop="toggleShow">
    <el-input v-if="selectType == 'normal'" :readonly="!filterable" v-model="searchVal" @keyup.native.down="downFn" :placeholder="placeStr" @keyup.native.up="upFn" @keyup.native.enter="confirmSelect">
      <i slot="suffix" class="el-icon-arrow-down" :class="{'rotate': selectShow}"></i>
    </el-input>
    <div class="select-group" v-if="selectType != 'normal'">
      <span class="select-val" v-show="selectVal == ''">选择分组</span>
    </div>
    <span class="select-val" v-show="searchVal == '' || selectType != 'normal'">{{selectLabel}}</span>
    <el-collapse-transition>
      <div v-show="selectShow" class="mp-select-wrapper">
        <div class="mp-select-content">
          <el-input class="mp-input" v-if="selectType != 'normal'" :readonly="!filterable" v-model="searchVal" @keyup.native.down="downFn" :placeholder="placeStr" @keyup.native.up="upFn" @keyup.native.enter="confirmSelect">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <ul v-show="searchVal == ''">
            <li v-for="item in options" :key="item[props.label]">
              <p class="parent-item" :class="{'active': item[props.value] == selectVal}" @click.stop="selectOption(item)">{{item[props.label]}}</p>
              <ul>
                <li class="child-option" :class="{'active': itm[props.value] == selectVal}" v-for="itm in item.children" @click.stop="selectOption(itm)" :key="itm[props.value]">{{itm[props.label]}}</li>
              </ul>
            </li>
            <div class="no-data" v-show="options.length == 0">无数据</div>
          </ul>
          <ul v-show="searchVal != ''">
            <li @click.stop="selectOption(item)" :class="{'active': index == activeIndex}" v-for="(item, index) in filterList" :key="item.label">{{item.label}}</li>
            <div class="no-data" v-show="filterList.length == 0">无匹配数据</div>
          </ul>
        </div>
        <div class="mp-arrow"></div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    value: [Number, String],
    filterable: Boolean,
    placeholder: {
      type: String,
      default: '商品分组'
    },
    options: {
      type: Array,
      default() {
        return []
      }
    },
    selectType: {
      type: String,
      default: 'normal'
    },
    props: {
      type: Object,
      default() {
        return {
          label: 'lable',
          value: 'value'
        }
      }
    }
  },
  data() {
    return {
      searchVal: '',
      selectLabel: '',
      selectShow: false,
      activeIndex: -1
    }
  },
  methods: {
    toggleShow() {
      this.selectShow = !this.selectShow
    },
    confirmSelect() {
      this.selectVal = this.filterList[this.activeIndex][this.props.value]
      this.selectLabel = this.filterList[this.activeIndex][this.props.label]
      this.searchVal = ''
      this.selectShow = false
    },
    selectOption(item) {
      this.selectShow = false
      this.searchVal = ''
      this.selectVal = item[this.props.value] || item.value
      this.selectLabel = item[this.props.label] || item.label
    },
    downFn() {
      if (this.searchVal && this.filterList.length - 1 > this.activeIndex) {
        this.activeIndex++
      }
    },
    upFn() {
      if (this.searchVal && this.activeIndex > 0) {
        this.activeIndex--
      }
    }
  },
  mounted() {
    document.addEventListener('click', () => {
      this.selectShow = false
      this.activeIndex = -1
      this.searchVal = ''
    })
  },
  computed: {
    selectVal: {
      get() {
        if (!this.value) {
          this.selectLabel = ''
        }
        return this.value
      },
      set(val) {
        this.$emit('input', val)
        this.$emit('change', val)
        let value = ''
      }
    },
    placeStr() {
      if (!this.selectVal && this.searchVal !== undefined) {
        if (this.selectVal === undefined) {
          return ''
        }
        return this.placeholder
      }
      return ''
    },
    filterList() {
      let arr = []
      this.options.forEach((item) => {
        if (item[this.props.label].indexOf(this.searchVal) != -1) {
          arr.push({
            label: item[this.props.label],
            value: item[this.props.value]
          })
        }
        if (item[this.props.value] == this.selectVal) {
          this.selectLabel = item[this.props.label]
        }
        if (item.children) {
          item.children.forEach((itm) => {
            if (itm[this.props.label].indexOf(this.searchVal) != -1) {
              arr.push({
                label: itm[this.props.label],
                value: itm[this.props.value]
              })
            }
            if (itm[this.props.value] == this.selectVal) {
              this.selectLabel = itm[this.props.label]
            }
          })
        }
      })
      return arr
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/css/mixin.scss';
.mp-select{
  position: relative;
  width: 200px;
  font-size: 14px;
  margin-right: 14px;
  display: inline-block;
  .el-input{
    cursor: pointer;
    z-index: 1000;
    input{
      cursor: pointer;
    }
  }
  .select-group{
    height: 40px;
    width: 100px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }
  .el-icon-arrow-down{
    line-height: 40px;
    margin-right: 5px;
    transition: all .3s;
  }
  .mp-arrow{
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    top: 48px;
    left: 15%;
    border-width: 6px;
    filter: drop-shadow(0 2px 12px rgba(0,0,0,.03));
    margin-right: 3px;
    border-top-width: 0;
    border-bottom-color: #ebeef5;
  }
  .mp-arrow::after{
    content: " ";
    border-width: 6px;
    top: 1px;
    margin-left: -6px;
    border-top-width: 0;
    border-color: transparent;
    border-bottom-color: #fff;
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
  }
  .rotate{
    transform: rotate(180deg);
  }
  .select-val{
    position: absolute;
    z-index: 1000;
    left: 13px;
    top: 14px;
    color: #606266;
    cursor: pointer;
  }
  .mp-select-wrapper{
    height: 372px;
    overflow: hidden;
    position: absolute;
    color: #606266;
    z-index: 100;
    width: 106%;
    left: -4px;
    top: 0
  }
  .mp-select-content{
    max-height: 300px;
    width: 94%;
    margin-left: 5px;
    padding: 6px 0;
    cursor: pointer;
    overflow-y: auto;
    position: absolute;
    top: 53px;
    background: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 2px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    @include scrollBar;
    .mp-input{
      // margin: 5px;
    }
    .no-data{
      line-height: 50px;
      text-align: center;
      color: #606266;
    }
    .parent-item{
      padding-left: 15px;
      line-height: 34px;
      &:hover{
        background: #f5f7fa;
      }
      &.active{
        color: #409EFF;
        font-weight: 700;
        // background: #f5f7fa;
      }
    }
    .child-option{
      padding-left: 38px;
      &:hover{
        background: #f5f7fa;
      }
    }
    li{
      line-height: 32px;
      &.active{
        color: #409EFF;
        font-weight: 700;
        // background: #f5f7fa;
      }
    }
  }
}
</style>
