/* eslint-disable */
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanPlugin = require("clean-webpack-plugin");

var ROOT_PATH = path.resolve(__dirname);
var CLIENT_PATH = path.resolve(ROOT_PATH, 'client');
var TEMPLATE_PATH = path.resolve(CLIENT_PATH, 'template');

module.exports = {
  devtool: 'source-map',
  entry: {
    index: path.resolve(CLIENT_PATH, 'index.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].[hash].js',
    // publicPath: './dist'
  },
  module: {
    rules: [
      // JS
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'client')
      },
      // img
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
      },
      // CSS
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'sass-loader'],
          publicPath: '../'
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  },
  resolve: {
    // 自动扩展文件后缀名
    extensions: ['.js', '.json', '.scss'],
    // 模块别名定义
    alias: {

    }
  },
  plugins: [
    // new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      title: '2048 Games',
      template: path.resolve(TEMPLATE_PATH,'index.html'),
      filename: 'index.html',
      chunks: ['index'],
      inject: 'body'
    }),
    new CleanPlugin(['dist']),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': "'production'"
      }
    }),
    new webpack.optimize.UglifyJsPlugin({optimize: true,compress:{warnings:false, drop_debugger: true, drop_console: true}}),
    new ExtractTextPlugin('css/style.css')
  ]
};
