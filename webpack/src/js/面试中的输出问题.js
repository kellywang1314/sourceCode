/* 
    js中在进行+/-存在类型转换，收集常见的类型转换,总结规则
    1. 在进行相加时候，number/boolean/null/undefined 都会优先转化为string进行运算
    2. 在进行相减时候，number/boolean/null/undefined 都会优先转化为number进行运算
*
*/

const aPlus = 100 + 10     // 110  可以使用100 + parseInt('10')
const bConcat = 100 + '10'   // 10010（字符串拼接）
const b1 = 100 - '10'  // 90
const c = true + '10'  // true10
const c3 = true - '10'  // -9
const c1 = undefined + '' //'undefined'	
const c2 = null + '' // 'null'
const c4 = null - '10' // -10
const d = 100 + parseInt('10uy')    // 110
const e = 100 + Number('10uy')     // NaN  Number 要求整体为数字
const f = 100 + parseInt('uy10')   // NaN  parseInt 从首字符起解析，首非数字则 NaN


/* 
    js中在进行==/=== 常见的题目
    1. 何时使用==何时使用===？ 除了==null之外，其他一律用===
*
*/

null == undefined   // true  宽松相等中二者被认为“抽象相等”
null === undefined  // false 严格相等需要类型和值都相同


/**
 * A
 * 构造函数：返回基本类型不会影响 new 的返回（仍返回实例对象）
 * @returns {number} -1（被忽略，new 返回实例对象）
 */
function A() {
    this.name = 'A'
    return -1
}
/**
 * B
 * 构造函数：返回对象会覆盖 new 的默认返回值（返回该对象）
 * @returns {{name:string}} 覆盖 new 的返回值
 */
function B() {
    this.name = 'B'
    return { name: 'b' }
}
/**
 * getName
 * 原型方法：输出当前 this.name，并返回 undefined
 * @returns {void}
 */
A.prototype.getName = B.prototype.getName = function () {
    console.log(this.name)
}
const a = new A()
console.log(a.name)  // "A"  构造函数返回基本类型被忽略，实例属性生效
const b = new B()
console.log(b.name)  // "b"  构造函数返回对象覆盖默认返回
console.log(a.getName())  // "A"  函数内部 console.log 输出 A；调用表达式返回 undefined
console.log(b.getName())  // undefined  函数内部先输出 "b"，但返回值为 undefined



