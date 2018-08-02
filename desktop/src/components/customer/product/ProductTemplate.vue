<template>
  <div class="product-template">
    <div>
      <ul class="template-list">
        <li class="template-item" v-for="item in templateList" :key="item.name">
          <div class="template-content">
            <img :src="item.bgImg" alt="">
            <span v-if="item.inUse" class="in-use">使用中</span>
            <div class="description">
              <p>{{item.description}}</p>
              <el-button type="primary" v-if="item.templateId == 1" @click="toRenovation('brief')" >{{item.inUse ? '去装修' : '立即使用'}}</el-button>
              <el-button type="primary" v-if="item.templateId == 2" @click="toRenovation('complex')">{{item.inUse ? '去装修' : '立即使用'}}</el-button>
            </div>
          </div>
          <p class="template-name">{{item.name}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex'
export default {
  data() {
    return {
      templateList: [
        {
          name: '电商模板一',
          description: '适用于商品数量少，风格较简约的店铺。',
          inUse: true,
          templateId: 1,
          bgImg: require('@/assets/imgs/template-a.jpg')
        },
        {
          name: '电商模板二',
          description: '适用于商品数量较多，需要多级分类的店铺。',
          inUse: false,
          templateId: 2,
          bgImg: require('@/assets/imgs/template-b.jpg')
        }
      ]
    }
  },
  methods: {
    toRenovation(type) {
      this.$router.push({
        path: '/productrenovation',
        query: {
          type
        }
      })
    },
    fillBack(val) {
      if (val == 0) {
        this.templateList[0].inUse = true
        this.templateList[1].inUse = false
      } else {
        this.templateList[1].inUse = true
        this.templateList[0].inUse = false
      }
    }
  },
  computed: {
    ...mapState([
      'facadeType'
    ])
  },
  mounted() {
    this.fillBack(this.facadeType)
    window.onbeforeunload  = null
  },
  watch: {
    facadeType(newVal) {
      this.fillBack(newVal)
    }
  }
}
</script>

<style lang="scss">
  .template-list{
    .template-item{
      display: inline-block;
      width: 260px;
      height: 500px;
      margin-right: 24px;
      .template-content{
        width: 100%;
        height: 464px;
        border-radius: 4px;
        position: relative;
        background: #e2e2e2;
        box-shadow: -1px 5px 17px -3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        img{
          width: 100%;
          height: 464px;
        }
        .in-use{
          position: absolute;
          top: 16px;
          left: -16px;
          background: rgba(0,0,0,0.6);
          text-align: center;
          text-indent: 10px;
          color: #fff;
          width: 88px;
          line-height: 32px;
          border-radius: 16px;
        }
        .description{
          position: absolute;
          left: 0;
          bottom: -134px;
          background: #fff;
          color: #606266;
          transition: all .3s;
          font-size: 14px;
          line-height: 16px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          box-sizing: border-box;
          height: 134px;
          padding: 22px;
          text-align: center;
          .el-button{
            margin-top: 16px;
          }
        }
        &:hover{
          .description{
            bottom: 0px;
          }
        }
      }
      .template-name{
        text-align: center;
        margin-top: 12px;
        font-size: 16px;
        color: #303133;
      }
    }
  }
</style>
