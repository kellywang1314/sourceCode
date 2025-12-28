
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/* 从根节点开始遍历，如果node1和node2中的任一个和root匹配，
那么root就是最低公共祖先。 如果都不匹配，则分别递归左、右子树，
如果有一个 节点出现在左子树，并且另一个节点出现在右子树，则root就是最低公共祖先.  
如果两个节点都出现在左子树，则说明最低公共祖先在左子树中，否则在右子树。 */

function GetLastCommonParent(head,node1,node2){
    if(head === null || node1===null || node2===null){
        return null
    }
    if(node1 == root || node2 == root){
        return root
    }
    let current
    let left = GetLastCommonParent(head.left,node1,node2)
    let right = GetLastCommonParent(head.right,node1,node2)
    if(left && right){
        return root
    }else if(left == null){
        return right
    }else{
        return left
    }
}



