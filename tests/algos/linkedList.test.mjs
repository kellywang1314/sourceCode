import { createList, listToArray, reverseList, mergeTwoLists, ListNode } from '../../code/linkedList.js'

function expectArrayEqual(a, b) {
  if (a.length !== b.length) throw new Error(`len ${a.length} != ${b.length}`)
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) throw new Error(`${a[i]} != ${b[i]} at ${i}`)
}

/**
 * run
 * 执行链表题目的单测
 */
export async function run() {
  let passed = 0, failed = 0
  const test = (name, fn) => { try { fn(); passed++ } catch (e) { failed++; console.error(`linkedList:${name}:`, e.message) } }

  test('reverseList basic', () => {
    const head = createList([1, 2, 3, 4])
    const rev = reverseList(head)
    expectArrayEqual(listToArray(rev), [4, 3, 2, 1])
  })

  test('mergeTwoLists sorted', () => {
    const a = createList([1, 3, 5])
    const b = createList([2, 4, 6])
    const m = mergeTwoLists(a, b)
    expectArrayEqual(listToArray(m), [1, 2, 3, 4, 5, 6])
  })

  console.log(`linkedList tests: ${passed} passed, ${failed} failed`)
  return { passed, failed }
}

