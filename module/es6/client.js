// ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，旨在成为浏览器和服务器通用的模块解决方案。
// 其模块功能主要由两个命令构成：export和import。
// export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。


// 使用import需要借助babel转换代码：npx babel-node index.js
import {add, basicNum} from './math'
console.log(add(2, 5))

// 这里对比commonjs，ES6 模块输出的是值的引用
console.log(basicNum)
setTimeout(() => {
    console.log(basicNum)
},5000)


