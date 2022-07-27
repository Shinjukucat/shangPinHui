import {reqDetailList, reqAddUpdataShopcart} from '@/api/index'
// 封装一个用户零时身份uuid，生成一次后保存就不能再变了
import {getUUID} from '@/utils/uuid_token'

const state = {
  // 存储商品详情的数据
  detailList: {},
  uuid_token: getUUID()
}

const mutations = {
  DETAILLIST(state, detaillist) {
    state.detailList = detaillist
  },
}

const actions = {
  async getDetailList({commit}, params) {
    let result = await reqDetailList(params);
    if(result.code === 200)
      commit('DETAILLIST', result.data)
  },
  // 返回的是添加购物车成功or失败，{skuId, skuNum}这里将传过来的对象里面的属性解构出来
  // 这里因为返回的只是添加成功或失败的结果。没有其他多余的data，所以没必要在仓库中存储什么数据
  async addUpdataShopcart({commit}, {skuId, skuNum}) {
    let result = await reqAddUpdataShopcart(skuId, skuNum);
    if(result.code === 200)
      return 'ok';
    else
      return Promise.reject(new Error('fasile'));
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
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}