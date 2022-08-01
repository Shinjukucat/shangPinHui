import {reqShopcartList, reqDeleteShop, reqChangeCheckedStatus} from '@/api/index'
import { reject } from 'lodash'
const state = {
  shopcartList: ['']
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
  },
  async deleteShop({commit}, skuId) {
    let result = await reqDeleteShop(skuId)
    if(result.code === 200)
      return 'ok'
    else
      return Promise.reject(new Error('faile'))
  },
  async changeChecked({commit}, {skuId, isChecked}) {
    let result = await reqChangeCheckedStatus(skuId, isChecked);
    if(result.code === 200)
      return 'ok';
    else
      return Promise.reject(new Error('faile'))
  },
  deleteAllShop({dispatch, getters}) {
    // actions方法里的context就相当于是一个小仓库，这里将context里面的dispatch和getters解构出来
    // console.log(getters)
    let PromiseAll = [];
    getters.shopCartList.forEach(item => {
      let promise = item.isChecked == 1 ? dispatch('deleteShop', item.skuId) : '';
      // 将每一次返回的Promise添加到数组中
      PromiseAll.push(promise);
    });
    // Promise.all判断PromiseAll是否返回的都是成功，就是监测所有isChecked == 1的shop是否都删除成功，全部成功就返回true，有一个不成功就返回false
    return Promise.all(PromiseAll)
  },
  // 全选框的点击
  changeAllChecked({dispatch, getters}, isAllChecked) {
    let promiseAll = [];
    getters.shopCartList.forEach(item => {
      // 这里就是应该将全选的复选框的状态传给那些商品的复选框
      // 就是说所有的复选框的在修改前的状态应该全部都假设为全选框的状态，全选框是0的状态，那么默认所有框都是0状态，点击后所有框变为1，其他情况同上
      // 就是所有商品的复选框的状态都要听从全选框的状态，当全选框从没有勾选变为勾选，那么所有复选框都要勾选，当全选框从勾选变为没有勾选的时候，那么所有复选框都要变为不勾选
      let promise = dispatch('changeChecked', {skuId: item.skuId, isChecked: isAllChecked});
      promiseAll.push(promise);
    });
    // 最终返回结果
    return Promise.all(promiseAll)
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