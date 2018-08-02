<template>
  <div class="all-order" >
    <div v-show="!isChildRouter" v-loading="loading">
      <div class="search-header">
        <p class="search-title">售后订单</p>
        <div style="margin-bottom: 16px;">
          <span class="label-text">
            订单状态: 
          </span>
          <el-select v-model="cancelStatus" placeholder="请选择" @change="changeStatus">
            <el-option
              v-for="item in statusOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span class="label-text">
            下单时间: 
          </span>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-input placeholder="输入搜索内容" v-model="query" @keyup.native.enter="getOrder" class="input-with-select">
            <el-select v-model="selectType" slot="prepend" placeholder="请选择">
              <el-option v-for="item in searchOptions" :label="item.label" :value="item.value" :key="item.label"></el-option>
            </el-select>
          </el-input>
          <!-- <div style="margin-top: 16px;">
            <el-button >全部导出</el-button>
          </div> -->
        </div>
      </div>
      <div class="order-wrapper">
        <div class="panel-title">
          <span>商品信息</span>
          <span>商品价格</span>
          <span>收货人信息</span>
          <span>
            <mp-sort @changeSort="sortFn">下单时间</mp-sort>
          </span>
          <span>退款金额</span>
          <span>售后状态</span>
          <span>操作</span>
        </div>
        <div class="order-list">
          <ul v-if="orderObj.currentPageDatas && orderObj.currentPageDatas.length">
            <li v-for="order in orderObj.currentPageDatas" :key="order.orderId">
              <div class="panel-header">
                订单编号： {{order.orderNumber}}  
              </div>
              <div class="panel-content">
                <div>
                  <span v-for="(item, index) in order.orderItems" :key="index">
                    {{item.productTitle}}
                  </span>
                </div>
                <div>
                  <span v-for="(item, idx) in order.orderItems" :key="idx">
                    ￥{{item.unitPrice}}
                  </span>
                </div>
                <div>
                  {{order.receiver}}
                </div>
                <div>
                  {{order.createTime | formatDate}}
                </div>
                <div>
                  ￥{{order.totalPrice}}(含运费￥{{order.freight}})
                </div>
                <div>
                  {{orderStatusText(order.cancelStatus, order.status)}}
                </div>
                <div>
                  <span class="link-text" @click="toDrawBack(order)" v-if="order.cancelStatus != 1 && order.cancelStatus != 2">处理退款</span>
                  <span class="link-text" @click="toDetail(order)">售后详情</span>
                 </div>
              </div>
            </li>
          </ul>
          <div v-else class="no-data">暂无数据</div>
        </div>
        <div class="page-container" v-if="orderObj.totalPageCount > 1">
          <el-pagination
            layout="prev, pager, next"
            @current-change="changePageIndex"
            :current-page="orderObj.currentPageIndex"
            :page-count="orderObj.totalPageCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { formatDate } from '@/filters/filters'
import MpSort from '@/components/public/MpSort'
export default {
  components: {
    MpSort
  },
  data() {
    let validateNumber = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入物流单号'))
      } else if (!Number(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    let validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入物流公司名称'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        logisticsNumber: '',
        logisticsName: ''
      },
      rules: {
        logisticsNumber: [
          { validator: validateNumber, trigger: 'blur' }
        ],
        logisticsName: [
          { validator: validateName, trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      isChildRouter: false,
      selectType: '1',
      query: '',
      orderStatus: '',
      dateRange: '',
      CreateTimeStart: null,
      CreateTimeEnd: null,
      IncludeStatus: ['Paid', 'Shipped'],
      IncludeCancelStatus: [0, 1, 2],
      Order: null,
      orderObj: {},
      editOrder: {},
      pageIndex: 1,
      loading: false,
      orderList: [],
      searchOptions: [
        {
          value: '1',
          label: '订单编号'
        },
        {
          value: '2',
          label: '商品名称'
        },
        {
          value: '3',
          label: '收货人姓名'
        },
        {
          value: '4',
          label: '联系电话'
        }
      ],
      pickerOptions: {
          shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      cancelStatus: 'all',
      statusOptions: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 0,
          label: '申请处理中'
        },
        // {
        //   value: 1,
        //   label: '同意申请'
        // },
        {
          value: 2,
          label: '申请退回'
        },
        {
          value: 1,
          label: '退款成功'
        }
      ]
    }
  },
  methods: {
    changeStatus(val) {
      if (val == 'all') {
        this.IncludeCancelStatus = [0, 1, 2]
      } else {
        this.IncludeCancelStatus = [val]
      }
      this.getOrder()
    },
    deliverGoods(order) {
      this.editOrder = order
      this.dialogVisible = true
    },
    confirmDeliverGoods() {
      this.$http.put('/api/Order/ship', {orders: [{
        orderId: this.editOrder.orderId,
        logisticsOrderNumber: this.ruleForm.logisticsNumber,
        companyName: this.ruleForm.logisticsName
      }]}).then((res) => {
        console.log(res)
        this.dialogVisible = false
      })
    },
    sortFn(val) {
      if (val == 'ascend') {
        this.Order = 'CreateTimeAes'
      } else {
        this.Order = 'CreateTimeDesc'
      }
      this.getOrder()
    },
    changePageIndex(index) {
      this.pageIndex = index
      this.getOrder()
    },
    getOrder() {
      let params = {
        CreateTimeStart: this.CreateTimeStart,
        CreateTimeEnd: this.CreateTimeEnd,
        Order: this.Order,
        StoreId: localStorage.getItem('storeId'),
        pageIndex: this.pageIndex,
        pageSize: 5,
        IncludePaymentMethods: 'Wechat'
      }
      switch (this.selectType) {
        case '1':
          params.OrderNumber = this.query
          break;
        case '2':
          params.ProductTitle = this.query
          break;
        case '3':
          params.Receiver = this.query
          break;
        case '4':
          params.Phone = this.query
          break;
        default:
          break;
      }
      this.loading =true
      let url = '/api/Order/summarys'
      let str = this.IncludeCancelStatus.map((item) => {
        return 'IncludeCancelStatus' + '=' + item
      }).join('&')
      url = '/api/Order/summarys?' + str
      this.$http.get(url, {
        params
      }).then((res) => {
        this.loading = false
        this.orderObj = res.data.data
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getOrder()
        })
      })
    },
    orderStatusText(cancelStatus, status) {
      let text
      switch (cancelStatus) {
        case 0:
          text = '申请退款中'
          break;
        case 1:
          if (status == 6) {
            text = '退款成功'
          } else {
            text = '退款中'
            text = '退款成功'
          }
          break;
        case 2:
          text = '申请退回'
          break;
        case 3:
          text = '已关闭'
          break;
        default:
          break;
      }        
      return text
    },
    changeDate(val) {
      if (val) {
        this.CreateTimeStart = new Date(val[0]).toLocaleDateString() + ' 00:00:00'
        this.CreateTimeEnd = new Date(val[1]).toLocaleDateString() + ' 23:59:59'
      } else {
        this.CreateTimeStart = null
        this.CreateTimeEnd = null
      }
      this.pageIndex = 1
      this.getOrder()
    },
    toDetail(item) {
      this.isChildRouter = true
      this.$router.push({
        path: `/aftersaleorder/orderdetail?orderid=${item.orderId}`
      })
    },
    toDrawBack(item) {
      this.isChildRouter = true
      this.$router.push({
        path: `/aftersaleorder/drawback?orderid=${item.orderId}`
      })
    }
  },
  mounted() {
    if (this.$router.currentRoute.name !== 'aftersaleorder') {
      this.isChildRouter = true
    } else {
      const orderStatus = this.$route.query.orderStatus
      if (orderStatus) {
        switch(orderStatus) {
          case "0":
            this.cancelStatus = Number(orderStatus)
            this.changeStatus(this.cancelStatus)
            break
          default:
            this.getOrder()
            break
        }
      } else {
        this.getOrder()
      }
    }
  },
  filters: {
    formatDate
  },
  computed: {
    pendingDeliveryOrder() {
      if (this.orderObj.currentPageDatas) {
        return this.orderObj.currentPageDatas.filter((item) => {
          return item.status == 3
        })
      }
    }
  },
  watch: {
    '$route'(newRouter) {
      if (newRouter.name == 'aftersaleorder') {
        this.getOrder()
        this.isChildRouter = false
      }
    },
    orderStatus(newVal) {
      if (newVal == 'All') {
        this.IncludeStatus = ['Paid', 'Shipped']
      } else {
        this.IncludeStatus = [newVal]
      }
      this.pageIndex = 1
      // this.getOrder()
    }
  },
}
</script>

<style lang="scss">
.form-group{
  width: 80%;
  margin: 0 auto;
}
.all-order{
  .order-wrapper{
    width: 100%;
    padding: 30px 20px 50px 20px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .panel-title{
      width: 100%;
      height: 48px;
      line-height: 48px;
      background-color: #fafafa;
      border: solid 1px #ebeef5;
      margin-bottom: 15px;
      .caret-wrapper{
        width: auto !important;
      }
      span{
        width: 14%;
        text-indent: 24px;
        display: inline-block;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        color: #909399;
        &:last-child{
          width: 13%;
        }
      }
    }
    .no-data{
      width: 100%;
      text-align: center;
      line-height: 28px;
    }
    .order-list{
      li{
        margin-bottom: 15px;
        .panel-header{
          width: 100%;
          height: 48px;
          line-height: 48px;
          background: #fafafa;
          text-indent: 24px;
          border: 1px solid #ebeef5;
          border-bottom: none;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          color: #909399;
        }
        .panel-content{
          border: 1px solid #ebeef5;
          box-shadow: none;
          overflow: hidden;
          margin-bottom: 0;
          padding-bottom: 0;
          // font-size: 0;
          color: #4d4f53;
          div{
            width: 14%;
            text-indent: 24px;
            display: inline-block;
            position: relative;
            font-size: 14px;
            box-sizing: border-box;
            vertical-align: middle;
            span{
              height: 50px;
              line-height: 50px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            &::after{
              content: '';
              position: absolute;
              width: 1px;
              height: 1600px;
              background: #ebeef5;
              right: 0;
              top: -300px;
            }
            &:first-child{
              color: #303133;
            }
            &:last-child{
              .link-text{
                color: #519ae9;
                cursor: pointer;
                display: inline-block;
                text-indent: 0;
                border: none;
              }
              &::after{
                content: '';
                position: absolute;
                width: 1px;
                height: 0;
                background: #ebeef5;
                right: 0;
                top: -300px;
              }
            }
            span{
              display: block;
              line-height: 50px;
              border-bottom: 1px solid #ebeef5;
              &:last-child{
                border-bottom: none;
              }
            }
            &:last-child{
              width: 13%;
            }
          }
        }
      }
    }
    .page-container{
      width: 100%;
      text-align: center;
      margin-top: 30px;
    }
  }
  .search-header{
    width: 100%;
    padding: 30px 20px;
    margin-bottom: 24px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .label-text{
      font-size: 14px;
      color: #303133;
    }
    .input-with-select{
      display: inline-block;
      width: 33%;
      margin-left: 20px;
      .el-input-group__prepend {
        background-color: #fff; 
        color: #909399;
        vertical-align: middle;
        display: table-cell;
        position: relative;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding: 9px 20px;
        display: inline-block;
        width: 86px;
        white-space: nowrap;
        border-right: none;
      }
      .el-select{
        width: 130px;
      }
      .el-input__inner{
        display: inline-block;
        width: 300px;
      }
      .el-input--suffix{
        .el-input__inner{
          display: inline-block;
          width: 130px;
        }
      }
    }
    .mp-select{
      width: 200px !important;
      .select-val{
        top: 14px !important;
      }
    }
    .el-dropdown{
      top: 0 !important;
    }
    .el-button{
      padding: 10px 20px !important;
      margin-left: 14px;
    }
    .el-button--primary{
      margin-left: 0;
    }
    .el-popper{
      margin-top: 12px !important;
    }
    .el-select{
      width: 200px;
      margin-right: 20px;
    }
    .mp-input{
      display: inline-block;
      width: 226px;
    }
    .search-title{
      font-size: 20px;
      margin-bottom: 16px;
    }
  }
}
</style>
