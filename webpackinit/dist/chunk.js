
        (function(modules) {
          function require(fileName) {
            const fn = modules[fileName];
            const module = { exports:{}};
            fn(require, module, module.exports)
            return module.exports
          }
          require('/Users/kellywang/project/koolearn/sourceCode/webpackinit/src/index.js')
        })({'/Users/kellywang/project/koolearn/sourceCode/webpackinit/src/index.js' : function(require, module, exports) {"use strict";

var _utils = require("./utils.js");

document.write((0, _utils.Cons)('超哥'));},'./utils.js' : function(require, module, exports) {"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Cons = exports.Cons = function Cons(param) {
  var res = param;
  return res + '帅';
};},})
    