import {reqUserAddress, reqOrderInfo} from '@/api/index'

const state = {
  userAddressList: [],
  orderInfo: {}
}

const mutations = {
  USERADDRESS(state, addressList) {
    state.userAddressList = addressList
  },
  GETORDERINFO(state, orderinfo) {
    state.orderInfo = orderinfo
  }
}

const actions = {
  // 请求用户地址信息
  async getUserAddress({commit}) {
    let result = await reqUserAddress();
    if(result.code === 200) {
      commit('USERADDRESS', result.data);
      console.log(result)
      return 'ok'
    } else {
      return Promise.reject(result.message)
    }
  },
  // 获取商品订单信息
  async getOrderInfo({commit}) {
    let result = await reqOrderInfo();
    if(result.code === 200) {
      commit('GETORDERINFO', result.data)
      return 'ok'
    } else {
      return Promise.reject(error.message)
    }
  }
}

const getters = {
  userAddressList() {
    return state.userAddressList || []
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}