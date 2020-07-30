/* 
    js中在进行+/-存在类型转换，收集常见的类型转换,总结规则
    1. 在进行相加时候，number/boolean/null/undefined 都会优先转化为string进行运算
    2. 在进行相减时候，number/boolean/null/undefined 都会优先转化为number进行运算
*
*/

const a = 100 + 10     // 110  可以使用100 + parseInt(‘10’)
const b = 100 + '10'   // 10010
const b1 = 100 - '10'  // 90
const c = true + '10'  // true10
const c3 = true - '10'  // -9
const c1 = undefined + '' //'undefined'	
const c2 = null + '' // 'null'
const c4 = null - '10'
const d = 100 + parseInt('10uy')    // 110
const e = 100 + Number('10uy')     // NAN
const f = 100 + parseInt('uy10')   // NAN


/* 
    js中在进行==/=== 常见的题目
    1. 何时使用==何时使用===？ 除了==null之外，其他一律用===
*
*/

null == undefined   // true
null === undefined  //false
