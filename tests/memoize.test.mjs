import { memoizeSingleArg, memoizeByJSON, memoizeWithResolver, memoizeDeep } from '../webpack/src/js/memoize.js'

const results = []

function test(name, fn) {
  try {
    fn()
    results.push({ name, pass: true })
  } catch (e) {
    results.push({ name, pass: false, error: e && e.message ? e.message : String(e) })
  }
}

function expectEqual(a, b) {
  if (a != b) throw new Error(`expectEqual failed: ${a} != ${b}`)
}

function expectStrictEqual(a, b) {
  if (a !== b) throw new Error(`expectStrictEqual failed: ${a} !== ${b}`)
}

function expectTrue(cond, msg = 'expectTrue failed') {
  if (!cond) throw new Error(msg)
}

// memoizeSingleArg 基础用例
test('memoizeSingleArg caches single argument function', () => {
  let calls = 0
  function square(n) { calls++; return n * n }
  const memoSquare = memoizeSingleArg(square)
  expectEqual(memoSquare(4), 16)
  expectEqual(memoSquare(4), 16)
  expectEqual(calls, 1)
  expectEqual(memoSquare(5), 25)
  expectEqual(calls, 2)
})

// memoizeSingleArg 保留 this
test('memoizeSingleArg preserves this context', () => {
  const obj = { base: 10, add(n) { return this.base + n } }
  const memoAdd = memoizeSingleArg(obj.add)
  expectEqual(memoAdd.call(obj, 1), 11)
  expectEqual(memoAdd.call(obj, 1), 11)
})

// 返回引用一致
test('memoizeSingleArg returns stable reference for same input', () => {
  function create(n) { return { n } }
  const memoCreate = memoizeSingleArg(create)
  const a = memoCreate(1)
  const b = memoCreate(1)
  expectStrictEqual(a, b)
})

// memoizeByJSON 多参数用例
test('memoizeByJSON caches by serialized args', () => {
  let calls = 0
  function sum(a, b) { calls++; return a + b }
  const memoSum = memoizeByJSON(sum)
  expectEqual(memoSum(1, 2), 3)
  expectEqual(memoSum(1, 2), 3)
  expectEqual(calls, 1)
  expectEqual(memoSum(1, 3), 4)
  expectEqual(calls, 2)
})

// memoizeWithResolver 自定义键
test('memoizeWithResolver uses custom key and caches', () => {
  let calls = 0
  function sum(a, b) { calls++; return a + b }
  const memoSum = memoizeWithResolver(sum, (a, b) => `${a}:${b}`)
  expectEqual(memoSum(2, 3), 5)
  expectEqual(memoSum(2, 3), 5)
  expectEqual(calls, 1)
})

// memoizeDeep 支持对象键
test('memoizeDeep supports object keys', () => {
  let calls = 0
  function heavy(obj, id) { calls++; return obj.value + id }
  const memoHeavy = memoizeDeep(heavy)
  const a = { value: 1 }
  const b = { value: 1 }
  expectEqual(memoHeavy(a, 2), 3)
  expectEqual(memoHeavy(a, 2), 3)
  expectEqual(memoHeavy(b, 2), 3)
  expectEqual(calls, 2)
})

// this 语义在 memoizeWithResolver 下保留
test('memoizeWithResolver preserves this context', () => {
  const obj = { base: 7, add(n) { return this.base + n } }
  const memoAdd = memoizeWithResolver(obj.add, (n) => String(n))
  expectEqual(memoAdd.call(obj, 3), 10)
  expectEqual(memoAdd.call(obj, 3), 10)
})

const passed = results.filter(r => r.pass).length
const failed = results.filter(r => !r.pass)
console.log(`memoize tests: ${passed} passed, ${failed.length} failed`)
if (failed.length) {
  failed.forEach((f, i) => console.error(`#${i + 1} ${f.name}: ${f.error}`))
  process.exitCode = 1
}

