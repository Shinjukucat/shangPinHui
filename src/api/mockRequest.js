// 对axios进行二次封装
import axios  from "axios";
// 引入nprogress进度条
import nprogress from "nprogress";
// 引入nprogress进度条样式
import "nprogress/nprogress.css"

// 1. 利用axios对象的create方法创建一个axios实例
// 2. request就是实例化出来的axios，在这里做一些配置
let request = axios.create({
  // 配置对象
  // 基础路径，发请求时会将 /api 添加到请求路径的前面
  baseURL: '/mock',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use((config) => {
  // 进度条开始
  nprogress.start()
  // config配置对象，对象里面有一个属性很重要，headers请求头
  return config
})

// 响应拦截器
request.interceptors.response.use((res) => {
  // 进度条结束
  nprogress.done()
  // 请求成功的回调函数
  return res.data;
}, (error) => {
  // 效应失败的回调函数
  return Promise.reject(new Error('faile'))
})


export default request