/**
 * Created by ww on 2018/8/15.
 */
/**给定一个二叉树，找出其最大深度。
 * 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。
 * 说明: 叶子节点是指没有子节点的节点。
 * 给定二叉树 [3,9,20,null,null,15,7]，
 *    3
 *   / \
 *  9  20
 *    /  \
 *   15   7
 * 返回它的最大深度 3
 */


/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
    if (root === null) {
        return 0
    }
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
};

// 迭代
/**
 * maxDeepth
 * 二叉树最大深度（迭代版，层序遍历 BFS）
 * - 使用队列逐层遍历，`currentCount` 记录当前层剩余节点数，`nextLevelCount` 记录下一层入队节点数
 * - 每当当前层节点遍历完（`currentCount === 0`），层数 `level` 加一，并将下一层计数转为当前层计数
 * @param {TreeNode} root 根节点
 * @returns {number} 最大深度
 */
var maxDeepth = function (root) {
    if (root === null) return 0
    let stack = [], currentLevelCount = 1, nextLevelCount = 0, level = 0
    stack.push(root)
    // BFS 队列：逐个出队当前层节点
    while (stack.length) {
        let node = stack.shift()
        currentLevelCount-- // 当前层剩余节点数减一
        if (node.left) {
            stack.push(node.left)
            nextLevelCount++ // 左子节点入队，统计下一层节点数
        }
        if (node.right) {
            stack.push(node.right)
            nextLevelCount++ // 右子节点入队
        }
        if (currentCount === 0) { // 当前层遍历完毕
            currentLevelCount = nextLevelCount // 将下一层节点数作为新的当前层计数
            nextLevelCount = 0 // 重置下一层计数
            level++ // 层数加一
        }
    }
    return level
}



