const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    // ���ÿ���
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8088',
    //     ws: true,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^api': ''
    //     }
    //   }
    // }
  }
})
