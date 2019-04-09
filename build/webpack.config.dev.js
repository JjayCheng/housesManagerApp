const base = require('./webpack.config.base');
const merge = require('webpack-merge');
const webpack = require('webpack');

const devServer = {
  port: 8080,
  host: '0.0.0.0',
  overlay: {
    errors: true
  },
  open: true,
  // 热加载, 改变组件只刷新组件
  hot: true,
  historyApiFallback: {
    index: '../index.html'
  }
}

module.exports = merge(base, {
  mode: process.env.NODE_ENV,
  devtool: '#cheap-module-eval-source-map',
  devServer: devServer,
  module: {
    rules: [
      {test: /\.css$/, use: ['vue-style-loader', 'css-loader', 'postcss-loader']},
      { test: /\.styl(us)?$/,use: ['vue-style-loader', 'css-loader', 'postcss-loader','stylus-loader'] }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 热加载
    new webpack.NoEmitOnErrorsPlugin() // webpack4废除， 减少不必要的提示
  ]
})