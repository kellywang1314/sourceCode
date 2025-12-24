// 这是一个关于 JavaScript 原型链的最小验证示例，分别检查构造函数、实例对象以及它们的原型之间的关系。

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

a.prototype === Object.prototype // true

// 实例 b 的内部原型指向构造函数的 prototype，这是 new 的核心语义
b.__proto__ === a.prototype // true

// a.prototype 默认是一个普通对象；其内部原型再上一层是 Object.prototype
b.__proto__.__proto__ === Object.prototype // true

// 再次验证：构造函数的 prototype 的内部原型为 Object.prototype（原型链顶端下一层）
a.prototype.__proto__ === Object.prototype // true

/**
 * myInstanceof
 * 使用原型链判断 obj 是否为构造函数 ctor 的实例（polyfill instanceof）
 * @param {object} obj 待检测对象
 * @param {Function} ctor 构造函数
 * @returns {boolean} 是否为实例
 */
export function myInstanceof(obj, ctor) {
    if (obj == null || typeof ctor !== 'function') return false
    let proto = Object.getPrototypeOf(obj)
    const target = ctor.prototype
    while (proto) {
        if (proto === target) return true
        proto = Object.getPrototypeOf(proto)
    }
    return false
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
