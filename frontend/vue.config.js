const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    // …Ë÷√øÁ”Ú
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
