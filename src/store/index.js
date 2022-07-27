import Vue from "vue";
import Vuex from "vuex";
import home from './home'
import search from './search'
import detail from './detail'
import shopcart from './shopcart'

// 注册vuex
Vue.use(Vuex);

// 对vuex进行模块化开发
// 这里是vuex的大仓库
export default new Vuex.Store({
  modules: {
    home,
    search,
    detail,
    shopcart
  }
})