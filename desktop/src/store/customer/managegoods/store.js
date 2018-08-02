/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    isChange: false
  },
  mutations: {
    setIsChange(state, flag) {
      state.isChange = flag
    }
  }
})
export default store