<template>
  <transition name="translate">
    <div class="mp-coupon-mask" >
      <div class="mp-coupon-container">
        <p class="mp-coupon-title">
          选择优惠券
          <span class="el-icon-close" @click="hide"></span>
        </p>
        <div class="mp-coupon-content">
          <div class="search-head">
            <el-button @click="toCouponPage">添加</el-button>
            <el-button @click="getCouponObj">刷新</el-button>
            <el-input
              class="mp-input"
              placeholder="按优惠券名称搜索"
              @keyup.native.enter="getCouponObj"
              v-model="displayName">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div class="mp-coupon-list">
            <table>
              <thead>
                <tr>
                  <td width="30%">
                    <el-checkbox v-model="allChecked" :indeterminate="isIndeterminate"></el-checkbox> 优惠券名称
                  </td>
                  <td width="25%">优惠内容</td>
                  <td width="30%">有效期</td>
                  <td width="15%">领取数量/总量</td>
                </tr>
              </thead>
              <tbody v-if="couponList.length > 0">
                <tr v-for="(item, index) in couponList" :key="index" :class="{'bg-tr': index % 2 != 0}">
                  <td><el-checkbox v-model="item.checked" ></el-checkbox> {{item.displayName}}</td>
                  <td>{{formatCouponContent(item.type, item.minimumOrderPrice, item.value)}}</td>
                  <td>{{formatDateRange(item.relativeExpiredMilliseconds, item.rangeExpired)}}</td>
                  <td>{{item.totalCount - item.availableCount}} / {{item.totalCount}}</td>
                </tr>
              </tbody>
            </table>
            <div v-show="couponList.length == 0" class="no-data">
              没有找到指定优惠券
            </div>
          </div>
        </div>
        <div class="footer-content">
          <span class="select-count">已选择<i :class="{'danger-count': checkedCouponList.length > 5}">{{checkedCouponList.length}}/5</i>个</span>
          <el-button @click="confirmSelect" type="primary">确定</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { formatDate } from '@/filters/filters'
export default {
  props: {
    checkedCoupon: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      couponVisible: false,
      isIndeterminate: false,
      displayName: '',
      couponObj: {},
      couponList: [],
      queryStr: '',
      pageIndex: 1
    }
  },
  methods: {
    confirmSelect() {
      if (this.checkedCouponList.length <= 5) {
        this.hide()
        this.$emit('confirmSelect', this.checkedCouponList)
      } else {
        this.$message.warning('最多添加5张优惠券')
      }
    },
    toCouponPage() {
      window.open('marketing.html#/coupon/addcoupon')
    },
    show() {
      this.couponVisible = true
    },
    hide() {
      this.$emit('hide')
    },
    chooseGoods(item) {
      this.$emit('selectGoods', item)
      this.hide()
    },
    formatDateRange(date, range) {
      let text
      if (date) {
        text = `领券当日开始${date / (1000 * 60 * 60 * 24)}天`
      }
      if (range) {
        text = formatDate(range.start, '/', true) + '-' + formatDate(range.end, '/', true)
       }
      return text
    },
    formatCouponContent(type, minimumOrderPrice, value) {
      let text
      if (type == 'Constant') {
        if (minimumOrderPrice) {
          text = `${value}元/${minimumOrderPrice}元可用`
        } else {
          text = `${value}元/不限`
        }
      } else {
        if (minimumOrderPrice) {
          text = `${value * 10 }折/${minimumOrderPrice}元可用`
        } else {
          text = `${value * 10 }折/不限`
        }
      }
      return text
    },
    getCouponObj() {
      let url = '/api/marketing/coupon/container/summarys'
      this.$http.get(url, {
        params: {
          displayName: this.displayName,
          orderBy: 'createTimeDesc',
          storeId: localStorage.getItem('storeId'),
          pageIndex: 1,
          pageSize: 100
        }
      }).then((res) => {
        this.couponObj = res.data.data
        this.couponList = this.couponObj.currentPageDatas
        if (this.checkedCoupon) {
          this.checkedCoupon.forEach((item) => {
            this.couponList.forEach((itm) => {
              if (item.couponContainerId == itm.couponContainerId) {
                this.$set(itm, 'checked', true)
              }
            })
          })
        }
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getCouponObj()
        })
      })
    }
  },
  computed: {
    checkedCouponList() {
      return this.couponList.filter((item) => {
        return item.checked
      })
    },
    allChecked: {
      get() {
        this.isIndeterminate = false
        let arr = this.couponList.filter((item) => {
          return item.checked
        })
        if (arr.length == this.couponList.length) {
          return true
        }
        if (arr.length > 0 && arr.length < this.couponList.length) {
          this.isIndeterminate = true
        }
        return false
      },
      set(val) {
        if (val) {
          this.couponList.forEach((item) => {
            this.$set(item, 'checked', true)
          })
        } else {
          this.couponList.forEach((item) => {
            item.checked = false
          })
        }
      }
    }
  },
  watch: {
    checkedCoupon(newVal) {
      if (newVal) {
        newVal.forEach((item) => {
          this.couponList.forEach((itm) => {
            if (item.couponContainerId == itm.couponContainerId) {
              // this.$set(itm, 'checked', true)
            } else {
              // this.$set(itm, 'checked', false)
            }
          })
        })
      }
    }
  },
  mounted () {
    this.getCouponObj()
  }  
}
</script>

<style lang="scss">
@import '~@/assets/css/mixin.scss';
.translate-enter-active, .translate-leave-active {
  transition: opacity .5s;
}
.mp-coupon-container{
  transition: all .5s;
}
.translate-enter, .translate-leave-to {
  opacity: 0;
  .mp-coupon-container{
    transform: translateY(-60%) !important;
  }
}
.mp-coupon-mask{
  position: fixed;
  z-index: 1001;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  left: 0;
  top: 0;
  .mp-coupon-title{
    position: relative;
    line-height: 80px;
    margin-bottom: 8px;
    text-align: center;
    font-size: 20px;
    color: #303133;
    .el-icon-close{
      position: absolute;
      font-size: 18px;
      right: -8px;
      top: 27px;
      color: #909399;
      cursor: pointer;
      font-weight: bold;
    }
  }
  .mp-coupon-container{
    width: 638px;
    height: 548px;
    position: absolute;
    background: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    left: 50%;
    top: 50%;
    margin-left: -319px;
    transform: translateY(-50%);
    padding:0 30px 30px 30px;
    .footer-content{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      border-top: 1px solid #e4e7ed;
      text-align: center;
      height: 98px;
      line-height: 98px;
      .select-count{
        position: absolute;
        left: 50px;
        i{
          font-style: normal;
        }
        .danger-count{
          color: #F56C6C;
        }
      }
    }
    .mp-coupon-content{
      font-size: 14px;
      .search-head{
        .label-text{
          display: inline-block;
          margin-right: 4px;
        }
        .mp-input{
          width: 240px;
          margin-left: 10px;
        }
      }
      .mp-coupon-list{
        max-height: 323px;
        overflow-y: auto;
        @include scrollBar;
        .no-data{
          text-align: center;
          font-size: 14px;
          color: #909399;
          line-height: 80px;
          width: 100%;
        }
        table{
          width: 100%;
          margin-top: 20px;
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
        }
      }
      .page-container{
        text-align: center;
        margin-top: 10px;
      }
    }
  }
}
</style>
