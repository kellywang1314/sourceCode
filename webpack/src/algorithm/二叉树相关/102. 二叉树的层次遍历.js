/**
 * Created by admin on 2018/10/14.
 */
/**给定一个二叉树，返回其按层次遍历的节点值。 （即逐层地，从左到右访问所有节点）。
 * 例如:
 * 给定二叉树: [3,9,20,null,null,15,7],
 *       3
 *      / \
 *     9  20
 *       /  \
 *      15   7
 * 返回其层次遍历结果：
 * [
 *  [3],
 *  [9,20],
 *  [15,7]
 * ]
 *
 */

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**非常朴素的想法
 * 用一个数组stack存放当前层数
 * 每次取其左右节点放入一个level数组中，
 * 当stack为空的时候，level就是当前层的，
 * 然后stack = level， level = []
 * 如此便得到了解答
 *
 * @param {TreeNode} root
 * @return {number[][]}
 */
/**
 * levelOrder
 * 二叉树层序遍历（迭代版，BFS）
 * - 使用一个“当前层队列”逐个出队节点，并将其子节点记录到“下一层数组”
 * - 当当前层处理完（队列为空）且存在下一层节点时，收集下一层的值并作为一行加入结果
 * - 然后将下一层数组复制为新的队列，继续处理后续各层
 * 时间复杂度：O(n)，空间复杂度：O(n)，其中 n 为节点数
 * @param {TreeNode} root 根节点
 * @returns {number[][]} 每一层的节点值列表
 */
var levelOrder = function(root) {
    // 空树直接返回空结果
    if (root === null) return [];

    // 结果集：先放入第一层（根节点）的值
    let res = [[root.val]];
    // 当前层“队列”（实际用数组 + shift，实现 FIFO）
    let stack = [root];
    // 下一层的节点暂存容器
    let level = [];
    // 当前出队的节点引用
    let head = null;

    // 当队列非空时，持续处理当前层
    while (stack.length) {
        // 取出当前层队头节点
        head = stack.shift();

        // 将左右孩子加入“下一层”容器（若存在）
        if (head.left !== null) {
            level.push(head.left)
        }
        if (head.right !== null) {
            level.push(head.right)
        }
        
        // 当前层已处理完：队列为空；且下一层已有节点
        if (!stack.length && level.length) {
            // 收集下一层所有节点的值，追加到结果集中
            res.push(level.map(node => node.val));
            // 下一层成为新的“当前层队列”，进入下一轮处理
            stack = level.slice();
            // 清空下一层暂存容器，等待新一轮填充
            level.length = 0;
        }
    }

    return res;
};



/**
 * bfs
 * 二叉树广度优先遍历（迭代版）：从上到下、从左到右依次访问节点
 * - 使用数组作为队列，采用 `shift()` 出队以直观表达 FIFO 行为
 * - 遍历过程中动态入队子节点，保证层序访问完整
 * @param {TreeNode} node 根节点
 * @returns {any[]} 节点值序列
 */
function bfs(node) {
    let result = []
    let queue = [node]
    while (queue.length) {
        const cur = queue.shift()
        result.push(cur.value)
        if (cur.left) queue.push(cur.left)
        if (cur.right) queue.push(cur.right)
    }
    return result
}
