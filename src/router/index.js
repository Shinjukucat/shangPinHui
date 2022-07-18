import Vue from 'vue'
import VueRouter from 'vue-router'

// 使用插件
Vue.use(VueRouter);
// 引入路由组件
const Home = () => import('@/views/Home')
const Search = () => import('@/views/Search')
const Login = () => import('@/views/Login')
const Register = () => import('@/views/Register')
 
// 解决多次跳转报错的问题
// 需要重写VueRouter.prototype原型对象身上的push|replace方法
// 先把VueRouter.prototype身上的push|replace方法保存一份
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;
// 重写VueRouter.prototype身上的push方法
VueRouter.prototype.push = function(location, resolve, reject) {
  // 第一个参数告诉原来的push往哪里跳
  // 第二个参数：成功的回调
  // 第三个参数：失败的回调
  if(resolve && reject) {
    // push方法传递第二个、第三个参数
    //originPush：利用call修改上下文，变为(路由组件.$router)这个对象，第二参数：配置对象、第三、第四个参数：成功和失败回调函数
    originPush.call(this, location, resolve, reject)
  } else {
    // 没有报错时，走的是下面这个方法。传入两个回调函数就可以解决多次跳转的报错
    originPush.call(this, location, () => {}, () => {})
  }
}
// 重写VueRouter.prototype身上的replace方法
VueRouter.prototype.replace = function(location, resolve, reject) {
  if(resolve && reject) {
    originReplace.call(this, location, resolve, reject)
  } else {
    originReplace.call(this, location, () => {}, () => {})
  }
}

// 配置路由
const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      // 配置路由原信息 meta ,里面放key: value
      meta: {show: true}
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      meta: {show: true}
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {show: false}
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {show: false}
    }
  ],
  mode: 'history'
})

// 将路由暴露
export default router; 