/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    isChange: false,
    appId: '',
    logisticsDetail: {}
  },
  mutations: {
    setIsChange(state, flag) {
      state.isChange = flag
    },
    setAppId(state, str) {
      state.appId = str
    },
    setLogisticsDetail(state, obj) {
      state.logisticsDetail = obj
    }
  }
})
export default store