// 这里将token的存储单独封装成一个函数，也是比较规范合理的写法
// 添加token
export const setToken = (token) => {
  localStorage.setItem('TOKEN', token)
}

// 获取token
export const getToken = () => {
  return localStorage.getItem('TOKEN')
}

// 清除token
export const removeToken = () => {
  localStorage.removeItem('TOKEN')
}