const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, './dist')
  },
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      inject: 'body'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: [
      path.resolve(__dirname, './src'),
      path.resolve(__dirname, '../'),
      path.resolve(__dirname, './dist')
    ],
    watchContentBase: true,
    compress: true,
    port: 8083,
    hot: true,
    open: false
  }
}
