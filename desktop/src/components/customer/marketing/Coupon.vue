<template>
  <div>
    <div class="coupon-wrapper" v-show="!isChildRouter"  v-loading="loading">
      <div class="common-header">
        <p class="search-title">全部优惠券</p>
        <div class="search-content">
          <el-select v-model="type" placeholder="优惠类型" @change="changeType">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
           <el-input
            class="mp-input"
            placeholder="搜索优惠券名称"
            @keyup.native.enter="getCouponObj"
            v-model="displayName">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <el-button type="primary" @click="addCoupon">添加优惠券</el-button>
      </div>
      <div class="coupon-container">
        <el-table
          v-if="couponObj.currentPageDatas"
          :data="couponObj.currentPageDatas"
          style="width: 100%">
          <el-table-column
            label="优惠券名称"
            prop="displayName">
          </el-table-column>
          <el-table-column
            label="优惠内容">
            <template slot-scope="scope">
              <span>{{ formatCouponContent(scope.row.type, scope.row.minimumOrderPrice, scope.row.value) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="领取限制">
            <template slot-scope="scope">
              <span> {{ scope.row.userReceivedCountLimit ? scope.row.userReceivedCountLimit + '张/人' : '不限' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="有效期范围">
            <template slot-scope="scope">
              <span>{{ formatDateRange(scope.row.relativeExpiredMilliseconds, scope.row.rangeExpired) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="领取数量/总数">
            <template slot-scope="scope">
              <span>{{ scope.row.totalCount - scope.row.availableCount }} / {{ scope.row.totalCount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              <span>{{ formatStatus(scope.row.relativeExpiredMilliseconds, scope.row.rangeExpired) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                type="text"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-container" v-if="couponObj.totalPageCount > 1">
          <el-pagination
            layout="prev, pager, next"
            @current-change="changePage"
            :current-page="couponObj.currentPageIndex"
            :page-count="couponObj.totalPageCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { formatDate } from '@/filters/filters'
export default {
  data() {
    return {
      isChildRouter: false,
      storeId: '',
      includeStatus: '',
      displayName: '',
      pageIndex: 1,
      pageSize: 10,
      type: '',
      loading: false,
      includeType: ['constant', 'percent'],
      typeOptions: [
        {
          label: '不限',
          value: 'unlimited'
        },
        {
          label: '代金券',
          value: 'constant'
        },
        {
          label: '折扣券',
          value: 'percent'
        }
      ],
      status: '',
      couponObj: {}
    }
  },
  methods: {
    handleEdit(index, row) {
      this.isChildRouter = true
      this.$router.push({
        path: '/coupon/modifycoupon',
        query: {
          couponid: row.couponContainerId
        }
      })
    },
    handleDelete(index, row) {
      this.$confirm('删除后，买家无法再领取该优惠券；买家之前已领到的优惠券，在有效期内还能继续使用。', '删除优惠券', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$http.delete(`/api/marketing/coupon/${row.couponContainerId}`).then((res) => {
          this.$message.success('删除成功')
          this.getCouponObj()
        }).catch((err) => {
          this.loginAgain(err).then(() => {
            this.handleDelete(index, row)
          })
        })
      }).catch((err) => {
        
      })
    },
    formatStatus(date, range) {
      let now = Date.now()
      let text
      if (date) {
        text = '已生效'
      } else {
        let startTime = new Date(range.start).getTime()
        let endTime = new Date(range.end).getTime()
        if (now < startTime) {
          text = '待生效'
        } else if (now > startTime && now < endTime) {
          text = '已生效'
        } else if (now > endTime) {
          text = '已过期'
        }
      }
      return text
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
    changeType(val) {
      if (val == 'unlimited') {
        this.includeType = ['constant', 'percent']
      } else {
        this.includeType =[val]
      }
      this.pageIndex = 1
      this.getCouponObj()
    },
    changePage(val) {
      this.pageIndex = val
      this.getCouponObj()
    },
    addCoupon() {
      this.isChildRouter = true
      this.$router.push({
        path: '/coupon/addcoupon'
      })
    },
    getCouponObj() {
      this.loading = true
      let url = '/api/marketing/coupon/container/summarys'
      if (this.includeType.length) {
        let str = this.includeType.map((item) => {
          return 'includeType' + '=' + item
        }).join('&')
        url = url + '?' + str
      }
      this.$http.get(url, {
        params: {
          displayName: this.displayName,
          orderBy: 'createTimeDesc',
          storeId: localStorage.getItem('storeId'),
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      }).then((res) => {
        this.loading = false
        this.couponObj = res.data.data
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getCouponObj()
        })
      })
    }
  },
  mounted() {
    if (this.$router.currentRoute.name !== 'coupon') {
      this.isChildRouter = true
    } else {
      this.getCouponObj()
    }
  },
  watch: {
    '$route'(newRouter) {
      if (newRouter.name == 'coupon') {
        this.isChildRouter = false
        this.getCouponObj()
      }
    }
  },
}
</script>

<style lang="scss">
@import '../../../assets/css/customer/common.scss';
.coupon-wrapper{
  .search-content{
    margin-bottom: 16px;
  }
  .mp-input{
    width: 226px;
  }
  .coupon-container{
    width: 100%;
    min-height: 200px;
    padding: 30px 20px 50px 20px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .page-container{
      text-align: center;
      margin-top: 40px;
    }
  }
}
</style>
