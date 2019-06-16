import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    // 设置属性
    listShow: false
  },
  getters: {
    // 获取属性的状态
    getListShow: state => state.listShow,
  },
  mutations: {
    // 改变属性的状态
    setListShow(state, data) {
      state.listShow = data
    },

  },
  actions: {
    // 应用mutations

  }
})
