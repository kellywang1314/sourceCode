/**
 * TreeNode
 * 二叉树节点结构
 * @param {number} val 节点值
 * @param {TreeNode|null} left 左子树
 * @param {TreeNode|null} right 右子树
 */
export function TreeNode(val, left = null, right = null) {
  this.val = val
  this.left = left
  this.right = right
}

/**
 * buildTreeFromArray
 * 由层序数组构造二叉树（null 表示缺失）
 * @param {Array<number|null>} arr 层序数组
 * @returns {TreeNode|null} 根节点
 */
export function buildTreeFromArray(arr) {
  if (!arr.length) return null
  const nodes = arr.map(v => v == null ? null : new TreeNode(v))
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i]) continue
    const l = 2 * i + 1, r = 2 * i + 2
    nodes[i].left = nodes[l] || null
    nodes[i].right = nodes[r] || null
  }
  return nodes[0]
}

/**
 * maxDepth
 * 二叉树最大深度（DFS）
 * @param {TreeNode|null} root 根节点
 * @returns {number} 最大深度
 */
export function maxDepth(root) {
  if (!root) return 0
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))
}

/**
 * isValidBST
 * 验证二叉搜索树（上下界递归）
 * @param {TreeNode|null} root 根节点
 * @returns {boolean} 是否有效
 */
export function isValidBST(root) {
  function helper(node, low, high) {
    if (!node) return true
    if ((low != null && node.val <= low) || (high != null && node.val >= high)) return false
    return helper(node.left, low, node.val) && helper(node.right, node.val, high)
  }
  return helper(root, null, null)
}

/**
 * levelOrder
 * 二叉树层序遍历（BFS），返回每层的数组
 * @param {TreeNode|null} root 根节点
 * @returns {number[][]} 层序结果
 */
export function levelOrder(root) {
  if (!root) return []
  const q = [root]
  const res = []
  while (q.length) {
    const size = q.length
    const level = []
    for (let i = 0; i < size; i++) {
      const node = q.shift()
      level.push(node.val)
      if (node.left) q.push(node.left)
      if (node.right) q.push(node.right)
    }
    res.push(level)
  }
  return res
}

