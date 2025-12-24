import { validParentheses } from '../../code/stackQueue.js'

function expectStrictEqual(a, b) { if (a !== b) throw new Error(`${a} !== ${b}`) }

/**
 * run
 * 执行栈/队列题目的单测
 */
export async function run() {
  let passed = 0, failed = 0
  const test = (name, fn) => { try { fn(); passed++ } catch (e) { failed++; console.error(`stackQueue:${name}:`, e.message) } }

  test('validParentheses basic', () => {
    expectStrictEqual(validParentheses('()'), true)
    expectStrictEqual(validParentheses('()[]{}'), true)
    expectStrictEqual(validParentheses('(]'), false)
    expectStrictEqual(validParentheses('([)]'), false)
    expectStrictEqual(validParentheses('{[]}'), true)
  })

  console.log(`stackQueue tests: ${passed} passed, ${failed} failed`)
  return { passed, failed }
}

