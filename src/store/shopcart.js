import {reqShopcartList} from '@/api/index'
const state = {
  shopcartList: []
}

const mutations = {
  SHOPCARTLIST(state, shopcartlist) {
    state.shopcartList = shopcartlist
  }
}

const actions = {
  async getShopcartList({commit}) {
    let result = await reqShopcartList();
    if(result.code === 200)
      commit('SHOPCARTLIST', result.data)
  }
}

const getters = {
  shopCartList() {
    return state.shopcartList[0].cartInfoList || []
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}