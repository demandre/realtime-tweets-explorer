'use strict';

var HtmlWebPackPlugin = require('html-webpack-plugin')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
// var Fiber = require('fibers');

var devMode = process.env.NODE_ENV !== 'production'

var htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html'
})

var miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: '[name].css',
  chunkFilename: '[id].css'
})

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {loader :'babel-loader'},
          {loader :'eslint-loader',
            options: {
              failOnError: true,
            }
          }
        ]
      },
      {
        test: /\.tpl$/,
        exclude: /node_modules/,
        use: [
          {
            loader :'html-loader',
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.(sc|sa|c)ss$/,
        use: [
          // fallback to style-loader in development
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
  },
  output: {
    publicPath: '/'
  },
  plugins: [
    htmlWebpackPlugin,
    miniCssExtractPlugin
  ]
}