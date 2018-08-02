/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store=new Vuex.Store({
  state: {
    isLogin: true
  },
  mutations: {
    setLogin(state, bol){
      state.isLogin = bol
    }
  }
})
export default store