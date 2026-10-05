import assert from 'node:assert/strict'
import test from 'node:test'
import { setTimeout as sleep } from 'node:timers/promises'

import * as throttleModule from '../webpack/src/js/common/防抖,节流.js'

const { throttleWithOptions } = throttleModule

test('默认同时支持 leading 和 trailing，并使用最后一次调用参数', async () => {
  assert.equal(typeof throttleWithOptions, 'function')

  const calls = []
  const throttled = throttleWithOptions(value => {
    calls.push(value)
  }, 30)

  throttled('first')
  throttled('second')
  throttled('last')

  assert.deepEqual(calls, ['first'])

  await sleep(50)

  assert.deepEqual(calls, ['first', 'last'])
})

test('leading=false 时仅在等待结束后执行 trailing', async () => {
  const calls = []
  const throttled = throttleWithOptions(value => {
    calls.push(value)
  }, 30, { leading: false })

  throttled('first')
  throttled('last')

  assert.deepEqual(calls, [])

  await sleep(50)

  assert.deepEqual(calls, ['last'])
})

test('trailing=false 时只执行 leading', async () => {
  const calls = []
  const throttled = throttleWithOptions(value => {
    calls.push(value)
  }, 30, { trailing: false })

  throttled('first')
  throttled('ignored')

  await sleep(50)

  assert.deepEqual(calls, ['first'])
})

test('leading 和 trailing 均为 false 时不执行目标函数', async () => {
  let callCount = 0
  const throttled = throttleWithOptions(() => {
    callCount += 1
  }, 20, { leading: false, trailing: false })

  throttled()

  await sleep(40)

  assert.equal(callCount, 0)
})

test('保留 this、返回值，并可取消待执行的 trailing', async () => {
  const context = {
    base: 10,
    calls: [],
  }
  const throttled = throttleWithOptions(function (value) {
    this.calls.push(value)
    return this.base + value
  }, 30)

  const result = throttled.call(context, 1)
  throttled.call(context, 2)
  throttled.cancel()

  await sleep(50)

  assert.equal(result, 11)
  assert.deepEqual(context.calls, [1])
})
