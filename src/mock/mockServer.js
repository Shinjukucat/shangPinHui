// 引入mockjs模板
import Mock from 'mockjs'
// 导入json数据
import banner from './banner'
import floor from './floor'

// mock(模拟)数据：第一个参数是请求地址，第二个参数是请求数据(状态码设置为200，数据源就是mock的json数据)
// mock出来的两个假的数据
Mock.mock("/mock/banner", {code: 200, data: banner});
Mock.mock("/mock/floor", {code: 200, data: floor})