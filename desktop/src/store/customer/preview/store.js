/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    configuration: {},
    count: 1,
    hasNavBar: true
  },
  mutations: {
    setConfiguration(state, obj) {
      state.configuration = obj
    },
    setCount(state, num) {
      state.count = num
    },
    setNavBar(state, bool) {
      state.hasNavBar = bool
    }
  }
})
export default store