/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    storeObj: {},
    isMainAccount: true
  },
  mutations: {
    setStoreObj(state, obj) {
      state.storeObj = obj
    },
    setMainAccount(state, flag) {
      state.isMainAccount = flag
    }
  }
})
export default store