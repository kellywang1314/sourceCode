import { binarySearch } from '../../code/binarySearch.js'

function expectEqual(a, b) { if (a != b) throw new Error(`${a} != ${b}`) }

/**
 * run
 * 执行二分查找题目的单测
 */
export async function run() {
  let passed = 0, failed = 0
  const test = (name, fn) => { try { fn(); passed++ } catch (e) { failed++; console.error(`binarySearch:${name}:`, e.message) } }

  test('binarySearch basic', () => {
    expectEqual(binarySearch([-1, 0, 3, 5, 9, 12], 9), 4)
    expectEqual(binarySearch([-1, 0, 3, 5, 9, 12], 2), -1)
  })

  console.log(`binarySearch tests: ${passed} passed, ${failed} failed`)
  return { passed, failed }
}

