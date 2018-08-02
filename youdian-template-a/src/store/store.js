// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    configuration: {},
    orderList: [],
    orderDetail: {},
    availableCouponList: [],
    isCartRefresh: true,
    isOrderListRefresh: false,
    currentCouponIndex: '',
    shareInfo: {},
    storeInfo: {},
    userInfo: {}
  },
  mutations: {
    setCount(state, count) {
      state.count = count
    },
    setConfiguration(state, obj) {
      state.configuration = obj
    },
    setOrderList(state, arr) {
      state.orderList = arr
    },
    setCartRefresh(state, bool) {
      state.isCartRefresh = bool
    },
    setOrderRefresh(state, bool) {
      state.isOrderListRefresh = bool
    },
    setOrderDetail(state, obj) {
      state.orderDetail = obj
    },
    setAvailableCouponList(state, arr) {
      state.availableCouponList = arr
    },
    setCurrentCouponIndex(state, index) {
      state.currentCouponIndex = index
    },
    setShareInfo(state, obj) {
      state.shareInfo = obj
    },
    setStoreInfo(state, obj) {
      state.storeInfo = obj
    },
    setUserInfo(state, obj) {
      state.userInfo = obj
    }
  }
})

export default store