import assert from 'node:assert/strict'
import test from 'node:test'

import * as cloneModule from '../webpack/src/js/common/深拷贝.js'

const { deepClone } = cloneModule

test('深拷贝 Map 的键和值并保留循环引用', () => {
  assert.equal(typeof deepClone, 'function')

  const sourceKey = { id: 1 }
  const sourceValue = { name: 'mapValue' }
  const sourceMap = new Map([[sourceKey, sourceValue]])
  sourceMap.set('self', sourceMap)

  const clonedMap = deepClone(sourceMap)
  const clonedKey = [...clonedMap.keys()].find(key => typeof key === 'object')

  assert.ok(clonedMap instanceof Map)
  assert.notEqual(clonedMap, sourceMap)
  assert.notEqual(clonedKey, sourceKey)
  assert.notEqual(clonedMap.get(clonedKey), sourceValue)
  assert.deepEqual(clonedMap.get(clonedKey), sourceValue)
  assert.equal(clonedMap.get('self'), clonedMap)
})

test('深拷贝 Set 的元素并保留循环引用', () => {
  assert.equal(typeof deepClone, 'function')

  const sourceValue = { name: 'setValue' }
  const sourceSet = new Set([sourceValue])
  sourceSet.add(sourceSet)

  const clonedSet = deepClone(sourceSet)
  const clonedValue = [...clonedSet].find(value => value !== clonedSet)

  assert.ok(clonedSet instanceof Set)
  assert.notEqual(clonedSet, sourceSet)
  assert.notEqual(clonedValue, sourceValue)
  assert.deepEqual(clonedValue, sourceValue)
  assert.ok(clonedSet.has(clonedSet))
})
