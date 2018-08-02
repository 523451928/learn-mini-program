/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    enableGoodsList: [],
    disableGoodsList: [],
    goodsUseType: 'enable'
  },
  mutations: {
    setGoodsList(state, arr) {
      if (state.goodsUseType == 'enable') {
        state.enableGoodsList = arr
      } else {
        state.disableGoodsList = arr
      }
    },
    setGoodsUseType(state, str) {
      state.goodsUseType = str
    },
    refreshGoodsList(state) {
      state.enableGoodsList = []
      state.disableGoodsList = []
    }
  }
})
export default store