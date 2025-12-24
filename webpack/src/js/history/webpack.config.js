const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
/* 
注意resolve规则，是不是加/或者./
path.resolve('/foo/bar', './baz');
返回: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
返回: '/tmp/file' 
*/
const config = {
  entry: path.resolve(__dirname, './client/index.js'),
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx'
    ]
  },
  devtool: "cheap-module-eval-source-map",
  plugins:[
    //new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './client/history.html'),
        filename:'history.html'
    }),
]

}

module.exports = config