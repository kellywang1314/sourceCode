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
 * change
 * 直接递归版：从指定 pid 开始构建树，当前层收集所有子节点并为每个子节点递归构建 children。
 * 思路：先找出当前父 pid 的所有子项，为每个子项递归生成其 children，最终返回当前层的 children 数组。
 * @param {Array<{id:number,name:string,pid:number}>} data 扁平数据
 * @param {number} pid 当前层的父 id（根通常为 0）
 * @returns {Array} 当前层的 children 数组
 * 复杂度：最坏 O(n^2)，每层线性扫描查找子节点；可用 Map 优化为 O(n)（见 arrayToTree）。
 */
function change(data = [], pid) {
  const children = []
  for (const item of data) {
    if (item.pid === pid) {
      const node = { ...item, children: change(data, item.id) }
      children.push(node)
    }
  }
  return children
}

/**
 * arrayToTree
 * Map 构建版：单次 O(n) 将扁平数组转为树结构（假定根 pid 为 0）
 * - 思路：先为每个 id 建立节点映射，再把每个节点挂到其父节点的 children
 * - 若某些数据的父节点不存在，按当前实现会为其创建一个仅含 children 的占位父节点
 * @param {Array<{id:number,name:string,pid:number}>} items 扁平数据
 * @returns {Array} 树结构数组（森林），根为 pid===0 的节点
 */
function arrayToTree(list = [], rootPid = 0) {
  const map = new Map()
  const res = []
  for (let i of list) {
    map.set(i.id, { ...i, children: [] })
  }
  for (let item of list) {
    const id = item.id
    const pid = item.pid
    const node = map.get(id) // 用id匹配节点
    if (pid === 0 || !map.has(pid)) {
      res.push(node)
    } else {
      const parent = map.get(pid)
      parent.children.push(node)
    }
  }
  return res

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







