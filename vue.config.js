/*
 * @Date         : 2020-06-10 14:39:32
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-07-10 15:54:19
 * @FilePath     : \vue.config.js
 */
/* eslint-disable */
const path = require('path');
const VueRouterInvokeWebpackPlugin = require('vue-router-invoke-webpack-plugin');
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  devServer: {
    open: true, //是否自动弹出浏览器页面
    // host: "0.0.0.0", //表示启动的时候使用的域名，默认可以不写，则是使用localhost和本机IP
    port: '8000', // 设置端口号
    proxy: {
      '/api': {
        target: process.env.VUE_APP_PROXY,
        changeOrigin: true,
        ws: true,
        // pathRewrite: {
        //   '^/api': ''
        // }
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('styles', resolve('src/styles'))
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'))
      .set('request', resolve('src/request'))
      .set('router', resolve('src/router'))
      .set('store', resolve('src/store'))
      .set('views', resolve('src/views'))
      .set('static', resolve('static'))
  },
  configureWebpack: {
    plugins: [
      new VueRouterInvokeWebpackPlugin({
        // dir: 'src/views',
        // // 必须设置dir配置的别名
        // alias: '@/views'
        'dir': 'src/pages',
        'alias': '@/pages',
        'routerDir': 'src/router',
        'language': 'typescript',
        'mode': 'hash',
        'redirect': [{
          redirect: '/menu',
          path: '/'
        }]
      })
    ]
  }
}
