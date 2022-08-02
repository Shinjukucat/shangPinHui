const Home = () => import('@/views/Home')
const Search = () => import('@/views/Search')
const Login = () => import('@/views/Login')
const Register = () => import('@/views/Register')
const Detail = () => import('@/views/Detail')
const AddCartSuccess = () => import('@/views/AddCartSuccess')
const ShopCart = () => import('@/views/ShopCart')
const Trade = () => import('@/views/Trade')
const Pay = () => import('@/views/Pay')
const PaySuccess = () => import('@/views/PaySuccess')
const Center = () => import('@/views/Center')
const myOrder = () => import('@/views/Center/myOrder')
const groupOrder = () => import('@/views/Center/groupOrder')

export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    // 配置路由原信息 meta ,里面放key: value，这里是的show控制的是底部footer的显示与隐藏
    meta: {show: true}
  },
  {
    // params参数要占位，这里用来传递搜素的关键字，加上问号代表这条params参数可传可不传
    path: '/search/:keyword?',
    name: 'Search',
    component: Search,
    meta: {show: true},
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
  },
  {
    // params参数，需要占位
    path: '/detail/:skuId',
    name: 'Detail',
    component: Detail,
    meta: {show: false}
  },
  {
    path: '/addcartsuccess',
    name: 'AddCartSuccess',
    component: AddCartSuccess,
    meta: {show: false}
  },
  {
    path: '/shopcart',
    name: 'ShopCart',
    component: ShopCart,
    meta: {show: false}
  },
  {
    path: '/trade',
    name: 'Trade',
    component: Trade,
    meta: {show: false},
    // trade页面的路由独享守卫
    beforeEnter: (to, from, next) => {
      // 如果从购物车来，直接放行
      if(from.path === '/shopcart') {
        next()
      } else {
        // next(false)好像不太支持了官方
        // 如果不是从购物车页面来的，那从哪来回哪去
        next(false)
        // next(from.path)
      }
    }
  },
  {
    path: '/pay',
    name: 'Pay',
    component: Pay,
    meta: {show: false},
    beforeEnter: (to, from, next) => {
      if(from.path === '/trade') {
        next()
      } else {
        next(false)
        // next(from.path)
      }
    }
  },
  {
    path: '/paysuccess',
    name: 'PaySuccess',
    component: PaySuccess,
    meta: {show: false},
    beforeEnter: (to, from, next) => {
      if(from.path === '/pay') {
        next()
      } else {
        next(false)
      }
    }
  },
  {
    // 个人中心的一级路由
    path: '/center',
    name: 'Center',
    component: Center,
    meta: {show: false},
    children: [
      {
        path: '/center',
        redirect: '/center/myorder'
      },
      {
        path: 'myorder',
        component: myOrder
      },
      {
        // 对二级路由做个重定向
        path: 'grouporder',
        component: groupOrder
      }
    ]
  }
]