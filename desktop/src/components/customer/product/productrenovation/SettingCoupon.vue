<template>
  <div class="setting-coupon setting-wrapper">
    <div class="setting-head">
      设置优惠券
      <span @click="deleteComponent" class="fr delete-btn">
        <span class="el-icon-delete"></span>
        删除
      </span>
    </div>
    <div class="coupon-container">
      <select-coupon v-if="couponVisible" @hide="couponVisible = false" ref="selectCoupon" :checkedCoupon="couponList" @confirmSelect="confirmSelect"></select-coupon>
      <div class="coupon-content">
        <table>
          <thead>
            <tr>
              <td width="80%">优惠券名称</td>
              <td width="20%">操作</td>
            </tr>
          </thead>
          <draggable class="default-drag" element="tbody" v-model="couponList" :options="dragOptions"  v-if="couponList.length > 0"> 
            <tr v-for="(item, index) in couponList" :key="index" :class="{'bg-tr': index % 2 != 0}">
              <td>{{item.displayName}}</td>
              <td>
                <span class="mp-link" @click="deleteCoupon(index)">删除</span>
              </td>
            </tr>
          </draggable>
        </table>
        <el-button @click="selectCoupon">选择优惠券</el-button> <span class="tips">最多可选5张优惠券</span>
      </div>
    </div>
  </div>
</template>

<script>
import SelectCoupon from './SelectCoupon'
import { dragOptions } from '@/assets/js/utils'
export default {
  props: {
    couponOptions: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    SelectCoupon
  },
  data() {
    return {
      dragOptions,
      editIndex: -1,
      isFirstGet: true,
      copyCouponList: [],
      couponVisible: false
    }
  },
  watch: {
    couponList: {
      handler(newVal) {
        this.submit()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    confirmSelect(arr) {
      this.copyCouponList = arr
    },
    deleteCoupon(index) {
      this.couponList.splice(index, 1)
    },
    selectCoupon() {
      this.couponVisible = true
    },
    deleteComponent() {
      this.$emit('deleteComponentBySetting')
    },
    submit() {
      this.$emit('changeCoupon', this.couponList)
    }
  },
  computed: {
    couponList: {
      get() {
        if (this.copyCouponList.length) {
          return this.copyCouponList
        } else {
          return this.isFirstGet ? this.couponOptions : []
        }
        this.isFirstGet = false
      },
      set(val) {
        this.copyCouponList = val
      }
    }
  },
  mounted() {
    
  }
}
</script>

<style lang="scss">
@import '~@/assets/css/mixin.scss';
.setting-coupon{
  min-height: 690px;
}
.setting-wrapper{
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  background: #fff;
  padding: 20px 30px;
  .coupon-container{
    .coupon-content{
      table{
        width: 100%;
        margin: 20px 0 10px 0;
        font-size: 14px;
        td{
          padding-left: 20px;
          white-space: nowrap;
          overflow: hidden;
          max-width: 154px;
          text-overflow: ellipsis;
        }
        thead{
          line-height: 46px;
          border-bottom: 1px solid #ebeef5;
          font-weight: bold;
          color: #7d8087;
        }
        tbody{
          tr{
            line-height: 46px;
            border-bottom: 1px solid #ebeef5;
          }
          .bg-tr{
            background: #fafafa;
          }
        }
        .no-data{
          text-align: center;
          font-size: 14px;
          color: #4d4f53;
          line-height: 80px;
          text-indent: 62px;
        }
      }
      .tips{
        font-size: 14px;
        color: #909399;
      }
    }
  }
  .img-content{
    height: 550px;
    overflow-y: auto;
    @include scrollBar;
    .img-item{
      background: #f5f8fc;
      padding: 20px;
      margin-bottom: 8px;
      .el-upload{
        
      }
      .img-upload{
        vertical-align: top;
        margin-bottom: 16px;
        .avatar-uploader{
          text-align: center;
          display: inline-block;
          width: 66px;
          height: 66px;
          border: 1px dashed #e0e3ea;
          background: #fff;
          line-height: 66px;
          border-radius: 4px;
          img{
            width: 100%;
          }
        }
        span{
          vertical-align: top;
        }
        .avatar-uploader{
          display: inline-block;
        }
      }
    }
    .label-text{
      display: inline-block;
      text-align: right;
      color: #606266;
      font-size: 14px;
      margin-right: 10px;
      width: 60px;
    }
  }
  .swiper-height{
    line-height: 68px;
    font-size: 14px;
    color: #606266;
    .el-input-number{
      width: 120px;
      .el-input__inner{
        text-align: left !important;
      }
    }
    span{
      margin-left: 14px;
    }
  }
  .setting-head{
    color: #303133;
    font-size: 16px;
  }
  .img-tips{
    font-size: 14px;
    color: #909399;
    margin-left: 5px;
  }
  .delete-btn{
    cursor: pointer;
    font-size: 14px;
    color: #1989fa;
  }
}

</style>
