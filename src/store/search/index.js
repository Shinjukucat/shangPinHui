// search模块的小仓库
import {reqSearchList} from '@/api/index'
const state = {
  searchList: {}
};
const mutations = {
  SEARCHLIST(state, searchlist) {
    state.searchList = searchlist
  }
};
const actions = {
  // 获取search搜索模块的数据
  // params参数是用户通过actions发请求dispatch时传入的，dispatch里的第一个参数是actions里的方法名，第二个参数就睡params
  async getSearchList({commit}, params) {
    let result = await reqSearchList(params);
    if(result.code === 200)
      commit('SEARCHLIST', result.data)
  }
};
// getters是用来简化数据的
// 通过getters将以后要在组件中使用的数据进行简化
// getters将请求到的searchList里面的数据细分出来，这样组件中口可以直接拿到searchList里面的数据
// 计算属性的意思就是利用已有的属性的属性值计算出一个新的属性，getters的state参数是默认传入的可写可不写，而且getters里面没有模块，所有state都是在一起的
const getters = {
  goodsList(state) {
    return state.searchList.goodsList
  },
  trademarkList(state) {
    return state.searchList.trademarkList
  },
  attrsList(state) {
    return state.searchList.attrsList
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}