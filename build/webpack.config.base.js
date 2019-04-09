const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HTMLplugin = require('html-webpack-plugin');

const config = {
  mode: 'production',
  entry: path.join(__dirname, '../src/index.js'),
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'app.js'
  },
  resolve: {
    alias: {
      'vue': path.join(__dirname, '../node_modules/vue/dist/vue.esm.js') // 更替 require('vue')文件
    }
  },
  module: {
    rules: [
      { test: /\.vue$/, use: {loader: 'vue-loader', options:{extractCSS: false}}},
      { test: /\.js$/, exclude: __dirname + 'node_modules', include: __dirname + 'src', loader: "babel-loader" },
      {test: /\.jsx$/, use: 'babel-loader'},
      {
        test: /\.(jpg|gif|svg|png|jpeg|ttf|woff|woff2|eot)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024,
            publicPath:"../../",
            name: path.posix.join('static', "img/[name].[hash:8].[ext]")
          }
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HTMLplugin({
      template: path.join(__dirname, '../index.html')
    })
  ]
}

module.exports = config;