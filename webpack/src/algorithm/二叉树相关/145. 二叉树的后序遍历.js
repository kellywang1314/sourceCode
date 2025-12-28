/**
 * Created by admin on 2018/10/13.
 */

/**给定一个二叉树，返回它的 后序 遍历。
 * 示例:
 * 输入: [1,null,2,3]
 *    1
 *     \
 *      2
 *     /
 *    3
 * 输出: [3,2,1]
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
 * @return {number[]}
 */
var postorderTraversal = function (root) {
    if (root === null) return [];
    let res = [];
    let stack = [root];
    while (stack.length) {
        let head = stack.pop();
        res.push(head.val);

        if (head.left !== null) {
            stack.push(head.left)
        }
        if (head.right !== null) {
            stack.push(head.right)
        }
    }
    return res.reverse();
};



function pos(root) {
    if (root === null) return []
    let res = []
    let stack = [root]
    while (stack.length) {
        if (root.right) {
            stack.push(root.right)
        } else if (root.left) {
            stack.push(root.left)
        } else {
            res.push(stack.pop().val)
        }
    }
    return res
}