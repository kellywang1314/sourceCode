
/* 从根节点开始遍历，如果node1和node2中的任一个和root匹配，
那么root就是最低公共祖先。 如果都不匹配，则分别递归左、右子树，
如果有一个 节点出现在左子树，并且另一个节点出现在右子树，则root就是最低公共祖先.  
如果两个节点都出现在左子树，则说明最低公共祖先在左子树中，否则在右子树。 */

/**
 * GetLastCommonParent
 * 功能：求二叉树中两个节点的最近公共祖先（LCA）
 * 思路：
 * - 若 head 为空，返回 null
 * - 若 head 等于 node1 或 node2，直接返回 head（当前节点就是最近公共祖先）
 * - 分别在左、右子树递归查找，得到 left/right
 * - 若 left 与 right 同时非空，说明 node1 与 node2 分居两侧，则 head 为最近公共祖先
 * - 否则返回非空者（node1 与 node2 都在某一侧的祖先链上）
 * 复杂度：时间 O(n)，空间 O(h)（h 为树高）
 * @param {Object|null} head 根节点
 * @param {Object} node1 第一个目标节点
 * @param {Object} node2 第二个目标节点
 * @returns {Object|null} 最近公共祖先节点或 null
 */
function GetLastCommonParent(head, node1, node2) {
    if (head === null || node1 === null || node2 === null) {
        return null
    }
    if (node1 == root || node2 == root) {
        return root
    }
    let left = GetLastCommonParent(head.left, node1, node2)
    let right = GetLastCommonParent(head.right, node1, node2)
    if (left && right) {
        return root
    } else if (left == null) {
        return right
    } else {
        return left
    }
}



