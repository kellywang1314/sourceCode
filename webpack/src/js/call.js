
//call源码实现:主要是把调用call的函数赋值给thisObj对象
let obj = {
  a: [1, 2, 3]
}

// fn.call(obj,1,2,3)
Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== 'function') {
    throw this + ' is not a function';
  }
  if (!context || context === null) {
    context = window;
  }
  let fn = Symbol('fn')
  context[fn] = this // 函数赋值给对象
  const result = context[fn](...args)
  delete context[fn]
  return result
}



/**
 * demoMyCall
 * 演示 myCall 如何绑定 this 并传递参数，返回拼接结果
 * @returns {void}
 */
export function demoMyCall() {
  const ctx = { prefix: '>' }
  function greet(a, b) { return this.prefix + a + b }
  const res = greet.myCall(ctx, 'A', 'B')
  console.log('demoMyCall:', res)
}

/**
 * myApply
 * 模拟原生 apply：以给定对象作为 this，用数组传参并立即执行
 * @param {Object} context 绑定的 this 对象，null/undefined 时默认 window
 * @param {Array} args 参数数组或类数组
 * @returns {any} 原函数的返回值
 */
Function.prototype.myApply = function (context, args) {
  if (typeof this !== 'function') {
    throw this + ' is not a function'
  }
  if (!context || context === null) {
    context = window
  }
  let fn = Symbol('fn')
  context[fn] = this
  const params = Array.isArray(args) ? args : []
  const result = context[fn](...params)
  delete context[fn]
  return result
}


/**
 * demoMyApply
 * 演示 myApply 以数组传参绑定 this 并返回结果
 * @returns {void}
 */
export function demoMyApply() {
  const ctx = { prefix: '#' }
  function greet(a, b) { return this.prefix + a + b }
  const res = greet.myApply(ctx, ['X', 'Y'])
  console.log('demoMyApply:', res)
}



/**
 * myBind
 * 返回绑定了 this 与部分参数的函数；支持作为构造函数使用时忽略绑定的 this
 * @param {Object} context 绑定的 this 对象
 * @param  {...any} args 预置参数
 * @returns {Function} 绑定后的函数
 */
Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('myBind target is not a function')
  }
  const target = this
  function boundFn(...innerArgs) {
    const isNewCall = this instanceof boundFn
    const thisArg = isNewCall ? this : context
    return target.apply(thisArg, [...args, ...innerArgs])
  }
  if (target.prototype) {
    boundFn.prototype = Object.create(target.prototype, {
      constructor: { value: boundFn, writable: true, configurable: true }
    })
  }
  return boundFn
};


/**
 * demoMyBind
 * 演示 myBind 生成绑定函数并传参调用
 * @returns {void}
 */
export function demoMyBind() {
  const ctx = { prefix: '~' }
  function greet(a, b) { return this.prefix + a + b }
  const bound = greet.myBind(ctx, 'P')
  const res = bound('Q')
  console.log('demoMyBind:', res)

  function User(prefix, name) { this.prefix = prefix; this.name = name }
  User.prototype.say = function () { return this.prefix + this.name }
  const BoundUser = User.myBind({ any: true }, 'B-')
  const u = new BoundUser('Jack')
  console.log('demoMyBind:new:', u.say())
}
