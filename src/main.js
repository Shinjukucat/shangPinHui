import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from '@/router/index'
// 引入store
import store from '@/store';

// 阻止显示当前生成模式的代码
// Vue.config.productionTip = false

// 全局组件的引入和注册
// Tabnav商品分类组件
import TabNav from '@/components/TabNav';
// 注册的第一个参数：全局组件的名字，第二个参数：指定是哪个组件
Vue.component(TabNav.name, TabNav)

new Vue({
  render: h => h(App),
  // 注册路由，因为key和value一致，所以可以省略value
  // 注册完路由后，路由组件和非路由组件身上都会具有$route和$router属性
  router,
  // 注册store，注册完成后，组件身上就会多一个$store属性
  store
}).$mount('#app')
