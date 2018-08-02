/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    productEditIndex: -1,
    editImgArr: [],
    classifyListA: [],
    classifyListB: [],
    // classifyActiveIndex: 0,
    classifyType: '',
    settingName: '',
    facadeType: '',
    shopInfo: {}
  },
  mutations: {
    setEditIndex(state, str) {
      state.productEditIndex = str
    },
    setImgArr(state, arr) {
      state.editImgArr = arr
    },
    changeSettingName(state, name) {
      state.settingName = name
    },
    setClassifyListA(state, arr) {
      state.classifyListA = arr
    },
    setClassifyListB(state, arr) {
      state.classifyListB = arr
    },
    setClassifyType(state, str) {
      state.classifyType = str
    },
    setFacadeType(state, str) {
      state.facadeType = str
    },
    setShopInfo(state, obj) {
      state.shopInfo = obj
    }
  }
})
export default store