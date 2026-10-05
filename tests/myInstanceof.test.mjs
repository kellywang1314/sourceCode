import assert from 'node:assert/strict'
import test from 'node:test'

import { myInstanceof } from '../webpack/src/js/common/原型链.js'

/**
 * 断言 myInstanceof 返回预期结果。
 * @param {*} value 待检测值
 * @param {*} constructor 构造函数
 * @param {boolean} expected 预期结果
 * @returns {void}
 */
function assertInstanceof(value, constructor, expected) {
  assert.equal(myInstanceof(value, constructor), expected)
}

test('沿原型链判断实例关系', () => {
  class Parent {}
  class Child extends Parent {}

  const instance = new Child()

  assertInstanceof(instance, Child, true)
  assertInstanceof(instance, Parent, true)
  assertInstanceof({}, Parent, false)
})

test('基本类型左值返回 false', () => {
  assertInstanceof(1, Number, false)
  assertInstanceof('text', String, false)
  assertInstanceof(null, Object, false)
})

test('构造函数无效时返回 false', () => {
  assertInstanceof({}, null, false)
  assertInstanceof({}, {}, false)
})
