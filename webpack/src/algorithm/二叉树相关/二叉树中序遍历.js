

// 按照访问左子树——根节点——右子树的方式遍历这棵树
var inorderTraversal = function (root) {
    if (!root) return []
    return [...inorderTraversal(root.left), root.val, ...inorderTraversal(root.right)]
}


var inorderTraversal = function (root) {
    const res = [];
    const stk = [];
    while (root || stk.length) {
        // 先把所有左子树压入栈内
        while (root) {
            stk.push(root);
            root = root.left;
        }
        root = stk.pop();
        res.push(root.val);
        root = root.right;
    }
    return res;
};


