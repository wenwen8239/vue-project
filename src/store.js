import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 存储数据的对象
const state = {
  username: ''
}
// 存储操作state数据的函数
const mutations = {
  setUsername: (state, value) => {
    state.username = value
  }
}
// 存储着触发mutations中的函数的方法
const actions = {
  setUsernameAction: ({ commit }, value) => {
    commit('setUsername', value)
  }
}
// 访问器
const getters = {
  getUsername: (state) => {
    return state.username
  }
}
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
