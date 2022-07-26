import {reqDetailList} from '@/api/index'

const state = {
  // 存储商品详情的数据
  detailList: {}
}

const mutations = {
  DETAILLIST(state, detaillist) {
    state.detailList = detaillist
  }
}

const actions = {
  async getDetailList({commit}, params) {
    let result = await reqDetailList(params);
    if(result.code === 200)
      commit('DETAILLIST', result.data)
  }
}

const getters = {
  // 之所以要加 || {} 因为当组件在渲染DOM的时候，组件使用了getters里面的数据，但是state.detailList开始的时候是个空对象，无法找到他下面的任何属性(报state.detailList下面的属性undefined的错)，等数据请求完毕后，它才找到对应的数据，但是浏览器在这之前会报错，虽然不影响效果，但是有报错。所以在还没有请求到数据的时候先将state.detailList对应的属性以空对象的形式返回回去，这样至少不会报错
  categoryView(state) {
    return state.detailList.categoryView || {}
  },
  skuInfo(state) {
    return state.detailList.skuInfo || {}
  },
  skuAttrValueList(state) {
    return state.detailList.skuInfo.skuAttrValueList || {}
  },
  spuSaleAttrList(state) {
    return state.detailList.spuSaleAttrList || []
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}