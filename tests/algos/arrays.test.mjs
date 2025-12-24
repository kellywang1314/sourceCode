import { twoSum, maxSubArray, moveZeroes, mergeIntervals } from '../../code/arrays.js'

function expectEqual(a, b) { if (a != b) throw new Error(`${a} != ${b}`) }
function expectStrictEqual(a, b) { if (a !== b) throw new Error(`${a} !== ${b}`) }
function expectArrayEqual(a, b) {
  if (a.length !== b.length) throw new Error(`len ${a.length} != ${b.length}`)
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) throw new Error(`${a[i]} != ${b[i]} at ${i}`)
}

/**
 * run
 * 执行数组题目的单测
 * @returns {Promise<{passed:number, failed:number}>}
 */
export async function run() {
  let passed = 0, failed = 0
  const test = (name, fn) => { try { fn(); passed++ } catch (e) { failed++; console.error(`arrays:${name}:`, e.message) } }

  test('twoSum basic', () => {
    const res = twoSum([2, 7, 11, 15], 9)
    expectArrayEqual(res, [0, 1])
  })

  test('maxSubArray kadane', () => {
    expectEqual(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6)
  })

  test('moveZeroes stable order', () => {
    const arr = [0, 1, 0, 3, 12]
    expectArrayEqual(moveZeroes(arr), [1, 3, 12, 0, 0])
  })

  test('mergeIntervals combine', () => {
    const res = mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]])
    expectArrayEqual(res[0], [1, 6])
    expectArrayEqual(res[1], [8, 10])
    expectArrayEqual(res[2], [15, 18])
  })

  console.log(`arrays tests: ${passed} passed, ${failed} failed`)
  return { passed, failed }
}

