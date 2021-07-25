/*
 * @Author: your name
 * @Date: 2020-06-25 19:27:30
 * @LastEditTime: 2021-07-09 12:39:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit/
 * @FilePath: /sourceCode/js/变量类型的判断方式.js
 */
/* 
js 类型检测方法的四种方法 
    typeof
    instanceof(数据类型)
    Object.prototype.toString.call()
    constructor（构造函数）
*  
*/

// 1. typeof：number/string/boolean/undefined/function/object

// 2. instance: 用于判断R的原型对象是不是在L的原型链上
function myInstance(L,R){
    while(true){
        if(L === null ) return false
        if(R.prototype === L) return true
        L = L.__proto__
    }
}

// 3. Object.prototype.toString
var a = 123;
console.log(Object.prototype.toString.call(a));    // [object Number]
var b = "string";
console.log(Object.prototype.toString.call(b));    // [object String]
var c = [];
console.log(Object.prototype.toString.call(c));    // [object Array]
var d = {};
console.log(Object.prototype.toString.call(d));    // [object Object]


// 4. constructor属性返回对创建此对象的数组函数的引用。
