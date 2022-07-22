// 当前这个文件第api进行同意管理
import request from "./request";

// 导入mock的请求文件
import mockRequest from './mockRequest'

// 请求三级联动接口的数据，封装成函数的形式，其他组件使用的时候直接引入这个函数并使用就可以了
// 发请求，axios发送请求的效应数据是Promise对象，需要进行简化
export const reqCategoryList = () => {
  // return request({url: '/product/getBaseCategoryList', method: 'get'});
  return request.get('/product/getBaseCategoryList');
}

// 封装轮播图图片的请求函数
export const reqGetBannerList = () => {
  return mockRequest.get('/banner')
}