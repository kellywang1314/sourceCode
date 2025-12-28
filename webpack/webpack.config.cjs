const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
    reactApp: path.resolve(__dirname, './src/react/index.jsx'),
    garfishDemo: path.resolve(__dirname, './src/grafish/test.jsx')
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, './dist')
  },
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { browsers: 'defaults' } }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              ['@babel/preset-typescript', {}]
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      inject: 'body',
      chunks: ['main'],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/react/index.html'),
      inject: 'body',
      chunks: ['reactApp'],
      filename: 'react.html'
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
    port: 8084,
    hot: true,
    open: false
  }
}
