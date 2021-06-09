// commonJS用同步的方式加载模块。在服务端，模块文件都存在本地磁盘，读取非常快
var math = require('./test.js');
console.log(math.add(2, 5))

// 证明：CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
console.log(math.basicNum)
setTimeout(() => {
    console.log(math.basicNum)
},5000)

