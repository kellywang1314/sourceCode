let arr = [
    {id: 1, name: '部门1', pid: 0},
    {id: 2, name: '部门2', pid: 1},
    {id: 3, name: '部门3', pid: 1},
    {id: 4, name: '部门4', pid: 3},
    {id: 5, name: '部门5', pid: 4},
    {id: 6, name: '部门1', pid: 0},
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
                    // 结果 ,,,
                ]
            }
        ]
    }
]


// 基础递归
const getChildren = (data,result,pid) => {
    for(let item of data){
        if(item.pid === pid){
            const newItem = {...item, children:[]}
            result.push(newItem)
            getChildren(data,newItem.children,item.id)
        }
    }
}

function change(data = [],pid){
    const res = []
    getChildren(data,res,pid)
    return res
}

// map方式
function arrayToTree(items) {
    const result = [];   // 存放结果集
    const itemMap = {};  // 
      
    // 先转成map存储
    for (const item of items) {
      itemMap[item.id] = {...item, children: []}
    }
    
    for (const item of items) {
      const id = item.id;
      const pid = item.pid;
      const treeItem =  itemMap[id];
      if (pid === 0) {
        result.push(treeItem);
      } else {
        if (!itemMap[pid]) {
          itemMap[pid] = {
            children: [],
          }
        }
        itemMap[pid].children.push(treeItem)
      }
  
    }
    return result;
}
  

