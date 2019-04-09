const base = require('./webpack.config.base');
const merge = require('webpack-merge');
const MiniCssEx = require('mini-css-extract-plugin');
const rimraf = require('rimraf');
const path = require('path');

rimraf(path.resolve(__dirname, '../dist'),err =>{
  if(err) throw err
})

module.exports = merge(base, {
  mode: process.env.NODE_ENV,
  output: {
    filename: path.posix.join('static', 'js/[name].[chunkhash:8].js'),
    chunkFilename: path.posix.join('static', 'js/[name].[chunkhash:8].js'),
  },
  module: {
    rules: [
      { test: /\.css$/, use: [MiniCssEx.loader, 'css-loader', 'postcss-loader'] },
      { test: /\.styl(us)?$/, use: [MiniCssEx.loader, 'css-loader', 'postcss-loader','stylus-loader'] }
    ]
  },
  optimization: { // js环境打包
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true
  },
  plugins: [
		new MiniCssEx({
      filename: path.posix.join('static', "css/[name].[chunkhash:8].css")
    })
  ]
})