const Home = () => import('@/views/Home')
const Search = () => import('@/views/Search')
const Login = () => import('@/views/Login')
const Register = () => import('@/views/Register')
const Detail = () => import('@/views/Detail')

export default [
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
  }
]