/* 
js 类型检测方法的四种方法 
    typeof
    instanceof(数据类型)
    Object.prototype.toString.call()
    constructor（构造函数）
*  
*/

// 1. typeof：number/string/boolean/undefined/function/object

// 2. instance: 用于判断R的原型对象是不是在L的原型链上, L 的 __proto__ 是不是等于 R.prototype，不等于再找 L.__proto__.__proto__ 直到 __proto__ 为 null
function myInstance(L,R){
    let O = R.prototype
    L = L.__proto__
    while(true){
        if(L === null ) return false
        if(O === L) return true
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
