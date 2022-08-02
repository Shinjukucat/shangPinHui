import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from '@/router/index'
// 引入store
import store from '@/store'
// 引入element-ui
import {Button, MessageBox, Form, FormItem, Input} from 'element-ui'

// 阻止显示当前生成模式的代码
// Vue.config.productionTip = false

// 全局组件的引入和注册
// Tabnav商品分类组件
import TabNav from '@/components/TabNav'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'
// 注册的第一个参数：全局组件的名字，第二个参数：指定是哪个组件
Vue.component(TabNav.name, TabNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagination.name, Pagination)
// 全局注册element-ui的组件，因为是按需引入，所以需要这一步
Vue.component(Button.name, Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 另外一种注册element-ui组件的方法，挂载在原型上
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

// 引入mock数据
import '@/mock/mockServer'

// 引入swiper样式
import 'swiper/css/swiper.css'

// 引入api文件夹里所有api接口函数
import * as http from '@/api'

// 引入图片懒加载的插件
import VueLazyload from 'vue-lazyload'
// 引入图片懒加载的图片
import lazyloadingImg from '@/assets/lazyloading.gif'
// 注册插件
Vue.use(VueLazyload, {
  loading: lazyloadingImg
})

new Vue({
  render: h => h(App),
  // 配置全局总线$bus
  beforeCreate() {
    Vue.prototype.$bus = this
    // 将这个api接口函数挂载到整个vue组件上，这个$http是组件随便取得名字，想怎么取怎么取，从这里开始P98使用直接调用api接口的方法，不再用vuex间接调用
    Vue.prototype.$http = http
  },
  // 注册路由，因为key和value一致，所以可以省略value
  // 注册完路由后，路由组件和非路由组件身上都会具有$route和$router属性
  router,
  // 注册store，注册完成后，组件身上就会多一个$store属性
  store
}).$mount('#app')
