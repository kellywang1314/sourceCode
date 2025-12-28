let arr = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 3 },
  { id: 6, name: '部门6', pid: 2 },
]


let res = [
  {
    "id": 1,
    "name": "部门1",
    "pid": 0,
    "children": [
      {
        "id": 2,
        "name": "部门2",
        "pid": 1,
        "children": []
      },
      {
        "id": 3,
        "name": "部门3",
        "pid": 1,
        "children": [
        ]
      }
    ]
  }
]


/**
 * getChildren
 * 递归收集某个 pid 的所有子节点，并为每个子节点继续收集其子孙
 * @param {Array<{id:number,name:string,pid:number}>} data 扁平数据
 * @param {Array} result 收集结果的 children 数组引用
 * @param {number} pid 当前父节点 id（根一般为 0）
 * @returns {void}
 */
const getChildren = (data, result, pid) => {
  for (let item of data) {
    if (item.pid === pid) {
      // newItem是找到的一个存在子节点的父节点
      const newItem = { ...item, children: [] }
      result.push(newItem)
      // 继续为newItem.children收集子节点
      getChildren(data, newItem.children, item.id)
    }
  }
}

/**
 * change
 * 基础递归版：根据给定根 pid，将扁平数组转换为树结构
 * - 时间复杂度 O(n^2)（最坏情况下，每层都线性扫描）
 * @param {Array<{id:number,name:string,pid:number}>} data 扁平数据
 * @param {number} pid 根节点的 pid（常用 0）
 * @returns {Array} 树结构数组（森林）
 */
function change(data = [], pid) {
  const res = []
  getChildren(data, res, pid)
  return res
}

/**
 * arrayToTree
 * Map 构建版：单次 O(n) 将扁平数组转为树结构（假定根 pid 为 0）
 * - 思路：先为每个 id 建立节点映射，再把每个节点挂到其父节点的 children
 * - 若某些数据的父节点不存在，按当前实现会为其创建一个仅含 children 的占位父节点
 * @param {Array<{id:number,name:string,pid:number}>} items 扁平数据
 * @returns {Array} 树结构数组（森林），根为 pid===0 的节点
 */
function arrayToTree(items) {
  const result = [];   // 存放结果集
  const itemMap = {};  // 

  // 先转成map存储
  for (const item of items) {
    itemMap[item.id] = { ...item, children: [] }
  }

  for (const item of items) {
    const id = item.id;
    const pid = item.pid;
    const treeItem = itemMap[id];
    if (pid === 0) {
      result.push(treeItem);
    } else {
      // if (!itemMap[pid]) {
      //   itemMap[pid] = {
      //     children: [],
      //   }
      // }
      itemMap[pid].children.push(treeItem)
    }
  }
  return result;
}

/**
 * demoFlatToTree
 * 用例：将示例数据 `arr` 转为树结构，并打印两种实现的结果
 * @returns {void}
 */
function demoFlatToTree() {
  console.log('递归版 change:', JSON.stringify(change(arr, 0), null, 2))
  console.log('Map版 arrayToTree:', JSON.stringify(arrayToTree(arr), null, 2))
}







