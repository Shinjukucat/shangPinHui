// home模块的小仓库
// 引入请求函数
import {reqCategoryList, reqGetBannerList, reqFloorList} from '@/api/index'
// state: 仓库存储数据的地方，相当于data
const state = {
  // state里面数据的格式根据服务器返回的数据格式而定，返回的数组就默认数组格式
  // TabNav部分请求到的数据列表
  categoryList: [],
  // 请求到的轮播图mock数据
  bannerlist: [],
  // 请求到的floor家用电器区域的数据
  floorList: []
};
// mutations: 修改state的唯一方法，只处理同步操作，放的是各种方法
const mutations = {
  // CATEGORYLIST里面的categoryList是actions里面commit传入的第二个参数result.data
  // 在mutations里面对state数据进行更改，把请求到的数据存储在state里面的属性中
  CATEGORYLIST(state, categoryList) {
    state.categoryList = categoryList
  },
  BANNERLIST(state, bannerlist) {
    state.bannerlist = bannerlist
  },
  FLOORLIST(state, floorlist) {
    state.floorList = floorlist
  }
};
// actions: 处理异步操作
const actions = {
  // 通过api里面封装的接口函数发送请求，获取服务器数据
  async categoryList({commit}) {
    let result = await reqCategoryList();
    if(result.code === 200)
      commit("CATEGORYLIST", result.data);
  },

  // 获取轮播图图片数据
  async getBannerList({commit}) {
    let result = await reqGetBannerList();
    if(result.code === 200)
      commit("BANNERLIST", result.data)
  },

  // 获取floor家用电器区域的数据
  async getFloorList({commit}) {
    let result = await reqFloorList();
    if(result.code === 200)
      commit("FLOORLIST", result.data)
  }
};
// getters: 相当于computed计算属性，用于简化仓库数据，让获取获取到的仓库数据更加精致
const getters = {};

export default {
  state,
  mutations,
  actions,
  getters
}