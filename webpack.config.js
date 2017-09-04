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
    filename: 'js/[name].[hash].js'
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
        loader: 'url-loader?limit=8192'
      },
      // CSS
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'sass-loader']
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
  plugins: [
    // new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      title: '首页',
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
    new webpack.optimize.UglifyJsPlugin({optimize: true,compress:{warnings:false,drop_console:true}}),
    new ExtractTextPlugin('css/style.css')
  ]
};
