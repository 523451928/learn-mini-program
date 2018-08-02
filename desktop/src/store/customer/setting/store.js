/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    businessType: '',
    isSubmit: false,
    mpUserInfo: {},
    mpShopInfo: {},
    isChange: false,
    permissions: []
  },
  mutations: {
    setBusinessType(state, str) {
      state.businessType = str
    },
    setMpUserInfo(state, obj) {
      state.mpUserInfo = obj
    },
    setMpShopInfo(state, obj) {
      state.mpShopInfo = obj
    },
    setSubmitStatus(state, flag) {
      state.isSubmit = flag
    },
    setIsChange(state, flag) {
      state.isChange = flag
    },
    setPermissions(state, arr) {
      state.permissions = arr
    }
  }
})
export default store