import { climbStairs, rob } from '../../code/dynamicProgramming.js'

function expectEqual(a, b) { if (a != b) throw new Error(`${a} != ${b}`) }

/**
 * run
 * 执行动态规划题目的单测
 */
export async function run() {
  let passed = 0, failed = 0
  const test = (name, fn) => { try { fn(); passed++ } catch (e) { failed++; console.error(`dp:${name}:`, e.message) } }

  test('climbStairs basic', () => {
    expectEqual(climbStairs(2), 2)
    expectEqual(climbStairs(3), 3)
    expectEqual(climbStairs(5), 8)
  })

  test('rob basic', () => {
    expectEqual(rob([1, 2, 3, 1]), 4)
    expectEqual(rob([2, 7, 9, 3, 1]), 12)
  })

  console.log(`dp tests: ${passed} passed, ${failed} failed`)
  return { passed, failed }
}

