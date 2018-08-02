<template>
  <div class="category-wrapper" >
    <div class="category-list">
      <ul>
        <li v-for="(item, index) in categoryList" :key="index">
          <img :src="item.imgUrl || defaultImg" alt="" @click="toGoodsList(item)">
          <p>{{item.categoryName ? item.categoryName : 'class'}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mixins } from '../mixins'
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
      defaultImg: require('@/assets/imgs/nav-default.png')
    }
  }
}
</script>

<style lang="scss">
  .category-wrapper{
    position: relative;
    padding: 8px 6px;
    background: #fff;
    margin-bottom: 10px;
    .category-list{
      ul{
        display: flex;
      }
      li{
        text-align: center;
        flex: 1;
        img{
          display: inline-block;
          width: 1.4rem;
          height: 1.4rem;
          border-radius: 4px;
        }
        .occupy-span{
          display: inline-block;
          width: 1.4rem;
          height: 1.4rem;
          background: #ebebeb;
          border-radius: 4px;
        }
        p{
          margin: 5px 0;
          font-size: 14px;
          color: #353535;
        }
      }
    }
    .delete-btn{
      display: inline-block;
      position: absolute;
      cursor: pointer;
      padding: 5px 10px;
      right: 7px;
      top: 7px;
      z-index: 1000;
      display: none;
      color: #fff;
      font-size: 12px;
      border-radius: 10px;
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
