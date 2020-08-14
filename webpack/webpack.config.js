const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
module.exports = {
    entry: path.resolve(__dirname, "./src/index.js"),
    output: {
        filename: "[name].[hash].js",
        path: path.resolve(__dirname, "./dist")
    },
    devtool: "cheap-module-eval-source-map",
    plugins: [
        new CleanWebpackPlugin()
    ],
    mode:'development'
}