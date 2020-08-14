const path = require("path")
module.exports = {
    entry: path.resolve(__dirname, "./webpackinit/src/index.js"),
    output: {
        filename: "chunk.js",
        path: path.resolve(__dirname, "./webpackinit/dist")
    },
}