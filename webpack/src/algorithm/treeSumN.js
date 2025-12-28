// 二叉树中和为某一值的路径
/* 输入一颗二叉树的根节点和一个整数，打印出二叉树中结点值的和为输入整数的所有路径。
路径定义为从树的根结点开始往下一直到叶结点所经过的结点形成一条路径。
 */

// 二叉数结构
/* function TreeNode(x) {
    this.val = x;
    this.left = null;
    this.right = null;
} */
function FindPath(root, num){
    let res = []
    if(root === null){
        return res
    }
    traversalTree(root,[],0,res,num) 
}

function traversalTree(root,path,sum,res,num){
    if(root===null && num === sum){
        res.push(path)
    }else if(root === null){
        return 
    }
    let newPath = path.concat(root.val)
    sum += root.val
    if(root.left === null && root.right === null && num===sum){
        res.push(newPath)
        return
    }
    traversalTree(root.left,newPath,sum,res,num)
    traversalTree(root.right,newPath,sum,res,num)
}