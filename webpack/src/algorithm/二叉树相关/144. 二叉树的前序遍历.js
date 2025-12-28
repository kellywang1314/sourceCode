/**给定一个二叉树，返回它的 前序 遍历。
 * 示例:
 * 输入: [1,null,2,3]
 *      1
 *       \
 *       2
 *      /
 *     3
 * 输出: [1,2,3]
 * 进阶: 递归算法很简单，你可以通过迭代算法完成吗？
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function (root) {
    if (root === null) return []
    let res = []
    let stack = [root]
    while (stack.length) {
        let head = stack.pop()
        res.push(head.val)
        if (head.right !== null) {
            stack.push(head.right)
        }
        if (head.left !== null) {
            stack.push(head.left)
        }
    }

    return res
};

/**
 * preorderTraversalRecursive
 * 二叉树前序遍历（递归版）：根 -> 左 -> 右
 * @param {TreeNode} root 根节点
 * @returns {number[]} 遍历结果
 */
function preorderTraversal(root) {
    if (!root) return []
    return [root.val, ...preorderTraversal(root.left), ...preorderTraversal(root.right)]
};


