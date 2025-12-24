import '../webpack/src/js/call.js'

/**
 * test
 * 简易测试用例收集器
 * @param {string} name 用例名称
 * @param {Function} fn 用例函数
 */
function test(name, fn) {
  try {
    fn()
    results.push({ name, pass: true })
  } catch (e) {
    results.push({ name, pass: false, error: e && e.message ? e.message : String(e) })
  }
}

/**
 * expectEqual
 * 断言非严格相等
 * @param {any} a 实际值
 * @param {any} b 期望值
 */
function expectEqual(a, b) {
  if (a != b) throw new Error(`expectEqual failed: ${a} != ${b}`)
}

/**
 * expectStrictEqual
 * 断言严格相等
 * @param {any} a 实际值
 * @param {any} b 期望值
 */
function expectStrictEqual(a, b) {
  if (a !== b) throw new Error(`expectStrictEqual failed: ${a} !== ${b}`)
}

/**
 * expectThrows
 * 断言抛出异常
 * @param {Function} fn 执行函数
 */
function expectThrows(fn) {
  let threw = false
  try { fn() } catch (e) { threw = true }
  if (!threw) throw new Error('expectThrows failed: did not throw')
}

const results = []

// 用例：this 绑定与参数传递
test('myCall 绑定 this 并传参', () => {
  function greet(a, b) { return this.prefix + a + b }
  const ctx = { prefix: '>' }
  const res = greet.myCall(ctx, 'A', 'B')
  expectEqual(res, '>AB')
})

// 用例：返回值与多次调用缓存不影响结果
test('myCall 正确返回值', () => {
  function add(x, y) { return x + y }
  const ctx = { any: 1 }
  expectEqual(add.myCall(ctx, 1, 2), 3)
  expectEqual(add.myCall(ctx, 3, 4), 7)
})

// 用例：默认上下文（在 Node 环境下 polyfill window）
test('myCall 空上下文使用默认 window', () => {
  global.window = global
  global.prefix = 'G'
  function say(n) { return this.prefix + n }
  const res = say.myCall(null, 'X')
  expectEqual(res, 'GX')
})

// 用例：非函数调用抛错
test('myCall 非函数调用抛出异常', () => {
  const ctx = {}
  expectThrows(() => {
    Function.prototype.myCall.call(123, ctx)
  })
})

// 用例：this 引用一致性
test('myCall this 引用一致', () => {
  const ctx = { id: 1 }
  function check() { return this === ctx }
  expectStrictEqual(check.myCall(ctx), true)
})

const passed = results.filter(r => r.pass).length
const failed = results.filter(r => !r.pass)
console.log(`myCall tests: ${passed} passed, ${failed.length} failed`)
if (failed.length) {
  failed.forEach((f, i) => console.error(`#${i + 1} ${f.name}: ${f.error}`))
  process.exitCode = 1
}

