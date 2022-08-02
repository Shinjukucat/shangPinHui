import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/router/routes'
import store from '@/store'
import { getToken } from '@/utils/token'

// 使用插件
Vue.use(VueRouter);
// 引入路由组件


// 解决多次跳转报错的问题
// 需要重写VueRouter.prototype原型对象身上的push|replace方法
// 先把VueRouter.prototype身上的push|replace方法保存一份
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;
// 重写VueRouter.prototype身上的push方法
VueRouter.prototype.push = function (location, resolve, reject) {
  // 第一个参数告诉原来的push往哪里跳
  // 第二个参数：成功的回调
  // 第三个参数：失败的回调
  if (resolve && reject) {
    // push方法传递第二个、第三个参数
    //originPush：利用call修改上下文，变为(路由组件.$router)这个对象，第二参数：配置对象、第三、第四个参数：成功和失败回调函数
    originPush.call(this, location, resolve, reject)
  } else {
    // 没有报错时，走的是下面这个方法。传入两个回调函数就可以解决多次跳转的报错
    originPush.call(this, location, () => { }, () => { })
  }
}
// 重写VueRouter.prototype身上的replace方法
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject)
  } else {
    originReplace.call(this, location, () => { }, () => { })
  }
}

// 配置路由
const router = new VueRouter({
  // ES6简化写法
  routes,
  // v-router滚动行为 在这里解决路由跳转后滚动条位置不在顶部的问题
  scrollBehavior(to, from, savedPosition) {
    return { y: 0 }
  },
  mode: 'history'
})

// 在暴露路由之前给他挂载一个全局路由导航守卫，检查是否携带token
router.beforeEach(async (to, from, next) => {

  const tokenStr = getToken();

  if(tokenStr) {
    // 登录的情况下
    if(to.path === '/login' || to.path === '/register') {
      next('/')
    } else {
        // 这里解决在home外的其他页面刷新时失去登录状态的问题，具体解释见day11笔记
        // 而且，这里为了避免还要判断去向的是不是home路由的麻烦，直接给去到除了登录注册外的所有路由都添加了发送获取用户信息的方法，其实也可以将home组件的获取用户信息方法去掉，避免home里面两次获取用户信息
        try {
          await store.dispatch('getUserInfo')
          next()
        } catch (error) {
          // 这里捕捉到错误情况是在我访问的是除登录注册外的页面而且请求失败了下，只能是一个原因就是用户的token失效了，无法根据token获取到用户信息，所以，在这里要将localStorage里面的token清除掉
          await store.dispatch('commitLoginout')
          next('/login')
        }
    }
  } else {
    // 没有登录的情况  未登录时，不能去交易相关的界面、不能去支付相关的界面、不能去个人中心，若在未登录情况下访问这些页面应重定向到登录页面
    // 拿到当前想要访问的路径
    let toPath = to.path;
    // indexOf是检查前面的字符串在后面小括号里面的字符串中的位置，没有则返回-1  toPath.indexOf('/pay')这句可以检测到包含pay这个字符串的所有路径，也就是检查/pay 和 /paysuccess 两个路径，/center就是携带这个字符串的路径都不能跳转
    if(toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1) {
      // next('/login')
      // 这里 ?key=value是query参数的固定写法
      next(`/login/?redirect=${toPath}`)
    } else {
      // 在未登录状态下跳转到除上面路径外的路径直接放行
      next()
    }
  }
  // 路由导航守卫拦截下来后，如果上述条件都不符合，一个next都没有返回的话，最后这里一定要无条件放行，不然拦截下来，不放行，之后的执行都进行不了了
  next()  //上面已经拦截了所有的情况了，这里这句其实现在要不要都无所谓
})

// 将路由暴露
export default router