import { TreeNode, buildTreeFromArray, maxDepth, isValidBST, levelOrder } from '../../code/tree.js'

function expectEqual(a, b) { if (a != b) throw new Error(`${a} != ${b}`) }
function expectStrictEqual(a, b) { if (a !== b) throw new Error(`${a} !== ${b}`) }
function expectArrayEqual(a, b) {
  if (a.length !== b.length) throw new Error(`len ${a.length} != ${b.length}`)
  for (let i = 0; i < a.length; i++) {
    if (Array.isArray(a[i]) && Array.isArray(b[i])) expectArrayEqual(a[i], b[i])
    else if (a[i] !== b[i]) throw new Error(`${a[i]} != ${b[i]} at ${i}`)
  }
}

/**
 * run
 * 执行二叉树题目的单测
 */
export async function run() {
  let passed = 0, failed = 0
  const test = (name, fn) => { try { fn(); passed++ } catch (e) { failed++; console.error(`tree:${name}:`, e.message) } }

  test('maxDepth basic', () => {
    const root = buildTreeFromArray([3, 9, 20, null, null, 15, 7])
    expectEqual(maxDepth(root), 3)
  })

  test('isValidBST basic', () => {
    const root1 = buildTreeFromArray([2, 1, 3])
    const root2 = buildTreeFromArray([5, 1, 4, null, null, 3, 6])
    expectStrictEqual(isValidBST(root1), true)
    expectStrictEqual(isValidBST(root2), false)
  })

  test('levelOrder basic', () => {
    const root = buildTreeFromArray([3, 9, 20, null, null, 15, 7])
    const levels = levelOrder(root)
    expectArrayEqual(levels, [[3], [9, 20], [15, 7]])
  })

  console.log(`tree tests: ${passed} passed, ${failed} failed`)
  return { passed, failed }
}

