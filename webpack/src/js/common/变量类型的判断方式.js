/* 
js 类型检测方法的四种方法 
    typeof
    instanceof(数据类型)
    Object.prototype.toString.call()
    constructor（构造函数）
*  
*/

// 1. typeof：number/string/boolean/undefined/function/object

/**
 * 2. myInstanceof
 * 使用原型链判断 obj 是否为构造函数 ctor 的实例（polyfill instanceof）
 * @param {object} obj 待检测对象
 * @param {Function} ctor 构造函数
 * @returns {boolean} 是否为实例
 */
// 验证：myInstanceof(b, a) 为 true，说明 b 是 a 的实例
export function myInstanceof(obj, ctor) {
    if (obj == null || typeof ctor !== 'function') return false
    while (true) {
        if (obj === null) return false
        if (obj === ctor.prototype) return true
        obj = obj.__proto__
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



/**
 * 4. myConstructor
 * 使用 constructor 判断 obj 是否为构造函数 ctor 的实例（polyfill constructor）
 * @param {object} obj 待检测对象
 * @param {Function} ctor 构造函数
 * @returns {boolean} 是否为实例
 */
// 验证：myConstructor(b, a) 为 true，说明 b 是 a 的实例
export function myConstructor(obj, ctor) {
    if (obj == null || typeof ctor !== 'function') return false
    return obj.constructor === ctor
}



