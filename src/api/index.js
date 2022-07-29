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

// 封装floor家用电器区域的数据请求
export const reqGetFloorList = () => {
  return mockRequest.get('/floor')
}

// 封装搜索search模块请求函数
export const reqSearchList = data => request.post('/list', data)

// 封装商品详情模块的数据请求函数
export const reqDetailList = params => request.get(`/item/${params}`)

// 添加或更新购物车数据的请求函数/api/cart/addToCart/{ skuId }/{ skuNum }
export const reqAddUpdataShopcart = (skuId, skuNum) => request.post(`/cart/addToCart/${skuId}/${skuNum}`)

// 封装获取购物车列表的请求函数
export const reqShopcartList = () => request.get('/cart/cartList')

// 封装删除商品的请求函数
export const reqDeleteShop = (skuId) => request.delete(`/cart/deleteCart/${skuId}`)

// 封装切换商品选中状态的请求函数
export const reqChangeCheckedStatus = (skuId, isChecked) => request.get(`/cart/checkCart/${skuId}/${isChecked}`)