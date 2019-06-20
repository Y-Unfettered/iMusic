import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    // 设置属性
    listShow: false,
    IsLoading: false,
    IsMaskLayer:false,
    IsCopyright:false,
    IsPlay: false,
    AddedSuccessfully:false,
    noMore:false,
    playerList:[]
  },
  getters: {
    // 获取属性的状态
    getListShow: state => state.listShow,
    getIsLoading: state => state.IsLoading,
    getIsMaskLayer: state => state.IsMaskLayer,
    getIsCopyright: state => state.IsCopyright,
    getIsPlay: state => state.IsPlay,
    getAddedSuccessfully: state => state.AddedSuccessfully,
    getPlayerList: state => state.playerList,
    getNoMore: state => state.noMore,

  },
  mutations: {
    // 改变属性的状态
    setListShow(state, data) {
      state.listShow = data
    },
    setIsLoading(state, data) {
      state.IsLoading = data
    },
    setIsMaskLayer(state, data) {
      state.IsMaskLayer = data
    },
    setIsCopyright(state, data) {
      state.IsCopyright = data
    },
    setIsPlay(state, data) {
      state.IsPlay = data
    },
    setAddedSuccessfully(state, data) {
      state.AddedSuccessfully = data
    },
    setPlayerList(state, data) {
      state.playerList = data
    },
    setNoMore(state, data) {
      state.noMore = data
    },
  },
  actions: {
    // 应用mutations

  }
})
