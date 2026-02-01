
/*
1. 问题：什么是prototype（原型）？
回答：在 JavaScript 中，只有构造函数拥有prototype属性，它是一个对象，称为「原型对象」。核心作用是存放该函数创建的所有实例共享的属性和方法，避免重复创建占用内存，同时是实现原型链继承的核心载体。
关键点：普通对象（非函数）没有prototype属性；构造函数的prototype默认包含constructor属性，指向函数自身。

2. 问题：什么是__proto__？
回答：__proto__是所有对象（包括函数、数组、普通对象、实例对象）都拥有的内部属性，指向该对象的构造函数的prototype原型对象，是连接对象与原型链的「桥梁」。

3. 问题：constructor属性的作用是什么？
回答：constructor是原型对象的固有属性，指向创建该原型对象对应的构造函数，用于标识对象的构造类型。实例对象可通过原型链访问到constructor，从而判断自身的构造来源。

4. 问题：什么是原型链？
回答：当访问一个对象的属性 / 方法时，执行链式查找规则：先在对象自身查找→找不到则通过__proto__去其构造函数的prototype查找→仍找不到则沿prototype的__proto__继续向上查找，直到null，这条链式查找路径就是原型链。
关键点：原型链的终点是null（Object.prototype.__proto__ === null），而非Object.prototype。
*/


/**
 * a
 * 构造函数示例，用于演示原型链关系
 * @returns {void}
 */
function a() { }

// 通过 new a() 创建实例 b，实例的内部原型（__proto__）将指向 a.prototype
const b = new a()

// 函数对象 a 的内部原型指向 Function.prototype，说明函数本身由 Function 构造
a.__proto__ === Function.prototype // true
a.prototype === Object.prototype // false, a.prototype 是一个普通对象，而不是 Object 实例
a.prototype.__proto__ === Object.prototype // true


// 实例 b 的内部原型指向构造函数的 prototype，这是 new 的核心语义
b.__proto__ === a.prototype // true
// a.prototype 默认是一个普通对象；其内部原型再上一层是 Object.prototype
b.__proto__.__proto__ === Object.prototype // true

/**
 * myInstanceof
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
        if (obj.__proto__ === ctor.prototype) return true
        obj = obj.__proto__
    }
}

function myInstanceof2(obj, Constructor) {
    // 基础类型直接返回false（instanceof不检测基础类型）
    if (typeof obj !== 'object' || obj === null) return false;
    // 获取对象的原型
    let proto = Object.getPrototypeOf(obj);
    // 沿原型链遍历
    while (true) {
        // 遍历到原型链终点，返回false
        if (proto === null) return false;
        // 找到构造函数的prototype，返回true
        if (proto === Constructor.prototype) return true;
        // 继续向上找原型
        proto = Object.getPrototypeOf(proto);
    }
}

/**
 * objectCreate
 * 简化版 Object.create 的实现：基于指定原型创建新对象
 * @param {object|null} proto 目标原型
 * @returns {object} 以 proto 为原型的新对象
 */
export function objectCreate(proto) {
    function F() { }
    F.prototype = proto
    return new F()
}

/**
 * myNew
 * 模拟 new 操作符：创建对象并绑定到构造函数原型，执行构造函数并返回
 * @param {Function} ctor 构造函数
 * @param  {...any} args 传入构造函数的参数
 * @returns {object} 实例对象
 */
export function myNew(ctor, ...args) {
    if (typeof ctor !== 'function') throw new TypeError('ctor must be function')
    const obj = Object.create(ctor.prototype)
    const res = ctor.apply(obj, args)
    return res !== null && (typeof res === 'object' || typeof res === 'function') ? res : obj
}


function myNew2(fn) {
    let obj = {}
    let fn = [...arguments].slice(0, 1)
    let args = [...arguments].slice(1)
    obj.__proto__ = fn.prototype
    let result = fn.apply(obj, args)
    return typeof result === 'object' ? result : obj
}

// 2. 描述下new做了什么
/* 2.1 创建一个空的对象
   2.2 把函数的原型对象赋值给对象的__proto__
   2.3 调用函数，并把函数的this指向新创建的对象
   2.4 如果该函数没有返回值或者返回值不是对象，则返回创建的对象，如果返回值是对象，则直接返回该对象。 */

// 3. {}/new Object()/Object.create() 的区别
/**
 * 
 * 首先三者都能创建一个新的对象，
 * {}和new Object()相比，{}效率更高，因为后者本质是一个函数，涉及到在原型链中遍历该函数，找到之后，还要涉及生成和销毁堆栈信息
 * 
 * Object.create()和前面两个不同是create创建的对象是以函数的参数为原型，而前面两个是用Object.prototype为原型
 * 
 * **/


/**
 * ownKeysVsIn
 * 区分自有属性与原型链属性：遍历对象并返回分类结果
 * @param {object} obj 输入对象
 * @returns {{ownKeys:string[], inherited:string[]}} 分类结果
 */
export function ownKeysVsIn(obj) {
    const ownKeys = []
    const inherited = []
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) ownKeys.push(key)
        else inherited.push(key)
    }
    return { ownKeys, inherited }
}

/**
 * getPrototypeChain
 * 返回对象的原型链数组（不包含对象本身），从最近原型到顶端 Object.prototype
 * @param {object} obj 输入对象
 * @returns {object[]} 原型链数组
 */
export function getPrototypeChain(obj) {
    const chain = []
    let cur = Object.getPrototypeOf(obj)
    while (cur) {
        chain.push(cur)
        cur = Object.getPrototypeOf(cur)
    }
    return chain
}

/**
 * demoPrototypeQuestions
 * 组合演示常见原型链题目的用法与结果
 * @returns {void}
 */
export function demoPrototypeQuestions() {
    function Person(name) { this.name = name }
    Person.prototype.say = function () { return 'hi ' + this.name }
    const p = new Person('Tom')

    console.log('myInstanceof(Person):', myInstanceof(p, Person))
    console.log('objectCreate(Person.prototype) has say:', typeof objectCreate(Person.prototype).say === 'function')
    const p2 = myNew(Person, 'Jerry')
    console.log('myNew -> say:', p2.say())
    console.log('ownKeysVsIn:', ownKeysVsIn(p))
    console.log('getPrototypeChain length:', getPrototypeChain(p).length)
}


