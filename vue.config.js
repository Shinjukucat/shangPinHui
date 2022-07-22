const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  // 代理跨域，解决跨域问题，proxy就是代理服务器或叫代理软件(具体见标签栏收藏)
  devServer: {
    proxy: {
      '/api': {
        target: 'http://gmall-h5-api.atguigu.cn',
        // 路径重写，这里每个请求路径都有 /api 这条路径，所以路径重写不需要
        // pathRewrite: {'^/api': ''}
      }
    }
  }
})

