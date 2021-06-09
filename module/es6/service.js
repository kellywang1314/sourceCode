
/*
    怎么在node直接使用es6的module，把package.json的增加"type": "module",
    import {add } from './math.js' ，注意引入时候必须math.js


    node:通过package.json的main字段类型指定入口文件（这个文件是ES模块）。
    你可以使用ES模块创建一个包。如果文件扩展名是.mjs或者package.json包含'type':'module'Node.js的话，
    Node.js将它作为ES模块加载。

*/
import {add } from './math.js'
console.log(add(2, 5))