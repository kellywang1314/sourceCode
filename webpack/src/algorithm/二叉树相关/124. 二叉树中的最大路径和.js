/**
 * Created by admin on 2018/10/7.
 */

/**给定一个非空二叉树，返回其最大路径和。
 * 本题中，路径被定义为一条从树中任意节点出发，达到任意节点的序列。该路径至少包含一个节点，且不一定经过根节点。
 * 输入: [-10,9,20,null,null,15,7]
 *    -10
 *    / \
 *   9  20
 *  /  \
 * 15   7
 * 输出: 42
 */

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**理解错了，一开始以为是以任意节点开始到叶子节点的和最大值；
 * 题目是任意路径和的最大值；
 *
 * 解题思路是这样的：https://www.jianshu.com/p/86d6f0932484
 *
 * 自然思维是这样的：
 * 从左右子树中获取最大的路径和的值，返回给left,right，然后从left,right,left+right+val,val中取最大值
 * 但这样的问题是，如果值都是负数时，左右子树会返回0，然后最大值会0，而不是负数
 *
 * 修正后的思路应该是：
 * 在递归函数中，如果当前结点不存在，那么直接返回0。否则就分别对其左右子节点调用递归函数，由于路径和有可能为负数，
 * 而我们当然不希望加上负的路径和，所以我们和0相比，取较大的那个，就是要么不加，加就要加正数。
 * 然后我们来更新全局最大值结果res，就是以左子结点为终点的最大path之和加上以右子结点为终点的最大path之和，
 * 还要加上当前结点值，这样就组成了一个条完整的路径。
 * @param {TreeNode} root
 * @return {number}
 */
/**
 * maxPathSum
 * 功能：返回二叉树的最大路径和（路径可从任意节点到任意节点，需沿父子相连的一条链）
 * 思路：后序 DFS 计算“向上可延伸的最大贡献”，丢弃负贡献；
 *       以当前节点作为“拐点”尝试更新全局最佳：node.val + max(0,left) + max(0,right)
 * 复杂度：时间 O(n)，空间 O(h)（递归栈，h 为树高）
 * @param {TreeNode|null} root 根节点
 * @returns {number} 最大路径和
 */
var maxPathSum = function (root) {
    let best = -Infinity;
    function dfs(node) {
        if (node == null) return 0;
        const leftGain = Math.max(0, dfs(node.left));
        const rightGain = Math.max(0, dfs(node.right));
        best = Math.max(best, node.val + leftGain + rightGain);
        return node.val + Math.max(leftGain, rightGain);
    }
    dfs(root);
    return best;
};