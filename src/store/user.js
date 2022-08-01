import {reqRegisterCode, reqRegister, reqLogin, reqUserInfo, reqLoginout, reqUserAddress} from '@/api/index'
import {setToken, removeToken} from '@/utils/token'
const state = {
  code: '',
  userInfo: {}
}

const mutations =  {
  GETCODE(state, code) {
    state.code = code
  },
  GETUSERINFO(state, userInfo) {
    state.userInfo = userInfo
  },
  clearUserInfo(state) {
    // 点击推出登录后需要清除 1.用户信息对个对象 2.清除localStorage里面的token 
    state.userInfo = {}
    removeToken()
  }
}

const actions = {
  // 获取验证码
  // 正常情况下，应该是这边点击获取验证码后后台发送信息到手机号上，验证码的发信息操作由后台负责，其实这边发送请求后就不用做其他操作了，等待用户输入验证码判断对不对就OK了
  async getRegisterCode({commit}, phone) {
    let result = await reqRegisterCode(phone);
    // 在正常情况下，以下内容都是不用写的，只要点击后发送一个请求就可以了，然后等待用户输入验证码，然后将用户输入的所有表单信息提交到注册请求中就OK了
    if(result.code === 200) {
      commit('GETCODE', result.data)
      return 'ok'
    } else {
      return Promise.reject(result.message)
    }
  },
  // 注册新用户
  async postRegister({commit}, registerForm) {
    let result = await reqRegister(registerForm);
    if(result.code === 200)
      return 'ok';
    else
      return Promise.reject(result.message)
  },
  // 登录
  async postLogin({commit}, loginForm) {
    let result = await reqLogin(loginForm);
    if(result.code === 200) {
      // console.log(result)
      // 登录成功后，对服务器返回的token进行持久化存储
      setToken(result.data.token)
      return 'ok'
    }
    else 
      return Promise.reject(result.message)
  },
  // 获取用户信息，通过请求头的token值
  async getUserInfo({commit}) {
    let result = await reqUserInfo();
    if(result.code === 200) {
      console.log(result)
      commit('GETUSERINFO', result.data)
      return 'ok'
    }
    else
      return Promise.reject(result.message)
  },
  // 退出登录
  async commitLoginout({commit}) {
    let result = await reqLoginout();
    if(result.code === 200) {
      // 因为要对state进行修改，这里必须到mutations里操作
      commit('clearUserInfo')
      return 'ok'
    }
    else
      return Promise.reject(result.message)
  }
}

const getters = {}


export default {
  state,
  mutations,
  actions,
  getters
}