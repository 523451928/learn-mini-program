<template>
  <div class="category-container" @click="changeComponent">
    <el-popover
      placement="top"
      width="170"
      v-model="popVisible">
      <p style="text-align: center; margin-top: 10px">确定删除分类组件吗？</p>
      <div style="text-align: center; margin: 10px">
        <el-button size="mini" round @click="popVisible = false">取消</el-button>
        <el-button round type="primary" size="mini" @click="deleteComponent">确定</el-button>
      </div>
      <span slot="reference" class="delete-btn">
        <span class="el-icon-delete"></span>删除
      </span>
    </el-popover>
    <div class="category-list">
      <ul>
        <li v-for="(item, index) in categoryList" :key="index">
          <img :src="item.imgUrl || defaultImg" alt="">
          <!-- <span v-else class="occupy-span"></span> -->
          <p>{{item.categoryName ? item.categoryName : '分类名称'}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mixins } from './mixins'
export default {
  mixins: [ mixins ],
  props: {
    categoryList: {
      type: Array,
      default() {
        return [
          {
            imgUrl: '',
            categoryName: '',
            groupId: ''
          },
          {
            imgUrl: '',
            categoryName: '',
            groupId: ''
          },
          {
            imgUrl: '',
            categoryName: '',
            groupId: ''
          },
          {
            imgUrl: '',
            categoryName: '',
            groupId: ''
          }
        ]
      }
    }
  },
  data() {
    return {
      defaultImg: require('@/assets/imgs/nav-default.png'),
      popVisible: false
    }
  }
}
</script>

<style lang="scss">
  .category-container{
    position: relative;
    padding: 6px;
    background: #fff;
    // margin-bottom: 10px;
    .category-list{
      ul{
        display: flex;
      }
      li{
        text-align: center;
        flex: 1;
        img{
          display: inline-block;
          width: 50px;
          height: 50px;
          border-radius: 4px;
        }
        .occupy-span{
          display: inline-block;
          width: 50px;
          height: 50px;
          background: #ebebeb;
          border-radius: 4px;
        }
        p{
          margin: 2px 0;
          font-size: 12px;
          color: #353535;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 68px;
        }
      }
    }
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
