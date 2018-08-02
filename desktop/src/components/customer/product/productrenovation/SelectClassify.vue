<template>
  <div class="select-classify setting-wrapper">
    <div class="setting-head">
      设置分类页面
    </div>
    <div class="select-classify-content">
      <ul>
        <li v-for="(item, index) in classifyTypeList" :key="index" @click="changeClassify(item)">
          <div :class="{'checked': item.type == classifyName, 'last-div': index == 1}">
            <span class="el-icon-success"></span>
          </div>
        </li>
      </ul>
    </div>
    <el-button type="primary" @click="useClassify">使用</el-button>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  props: {
    
  },
  data() {
    return {
      classifyName: 'classifyA',
      classifyTypeList: [
        {
          type: 'classifyA'
        },
        {
          type: 'classifyB'
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'classifyType'
    ])
  },
  watch: {
   
  },
  methods: {
    ...mapMutations([
      'changeSettingName', 'setClassifyType'
    ]),
    useClassify() {
      if (this.classifyName == 'classifyA') {
        this.changeSettingName('SettingClassifyA')
        this.setClassifyType('SettingClassifyA')
      } else {
        this.changeSettingName('SettingClassifyB')
        this.setClassifyType('SettingClassifyB')
      }
      this.$emit('changeComponentName')
    },
    changeClassify(item) {
      this.classifyName = item.type
    }
  },
  mounted() {
    if (this.classifyType == 'SettingClassifyA') {
      this.classifyName = 'classifyA'
    } else {
      this.classifyName = 'classifyB'
    }
  }
}
</script>

<style lang="scss">
.select-classify{
  width: 100%;
  height: 606px;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  background: #fff;
  padding: 20px 30px;
  .setting-head{
    color: #303133;
    font-size: 16px;
  }
  .select-classify-content{
    margin: 20px 0;
    li{
      display: inline-block;
      cursor: pointer;
      width: 210px;
      height: 376px;
      margin-right: 18px;
      div{
        position: relative;
        height: 100%;
        border: 1px solid #eff1f6;
        background: url('../classify-a.png');
        background-size: cover;
        .el-icon-success{
          font-size: 24px;
          position: absolute;
          right: 10px;
          top: 10px;
          color: #848484;
          opacity: .9;
        }
      }
      .last-div{
        background: url('../classify-b.png');
        background-size: cover;
      }
      .checked{
        .el-icon-success{
          color: #1989fa;
          opacity: 1;
        }
      }
    }
  }
}
</style>
