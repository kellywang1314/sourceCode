/**
 * ListNode
 * 单链表节点结构
 * @param {number} val 节点值
 * @param {ListNode|null} next 下一个节点
 */
export function ListNode(val, next = null) {
  this.val = val
  this.next = next
}

/**
 * createList
 * 通过数组创建单链表
 * @param {number[]} arr 数组
 * @returns {ListNode|null} 头节点
 */
export function createList(arr) {
  let dummy = new ListNode(0)
  let cur = dummy
  for (const v of arr) {
    cur.next = new ListNode(v)
    cur = cur.next
  }
  return dummy.next
}

/**
 * listToArray
 * 将链表转换为数组，便于断言
 * @param {ListNode|null} head 头节点
 * @returns {number[]} 数组
 */
export function listToArray(head) {
  const res = []
  let cur = head
  while (cur) { res.push(cur.val); cur = cur.next }
  return res
}

/**
 * reverseList
 * 反转单链表
 * @param {ListNode|null} head 头节点
 * @returns {ListNode|null} 新头节点
 */
export function reverseList(head) {
  let prev = null, cur = head
  while (cur) {
    const nxt = cur.next
    cur.next = prev
    prev = cur
    cur = nxt
  }
  return prev
}

/**
 * mergeTwoLists
 * 合并两个有序链表，返回有序结果
 * @param {ListNode|null} l1 链表1
 * @param {ListNode|null} l2 链表2
 * @returns {ListNode|null} 合并结果
 */
export function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0)
  let cur = dummy
  let a = l1, b = l2
  while (a && b) {
    if (a.val < b.val) { cur.next = a; a = a.next }
    else { cur.next = b; b = b.next }
    cur = cur.next
  }
  cur.next = a || b
  return dummy.next
}

