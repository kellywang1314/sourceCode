let menu = [
    { "Id": 1, "ParentId": null, "Sort": 0, "Name": "菜单1" },
    { "Id": 2, "ParentId": 1, "Sort": 0, "Name": "菜单1-1" },
    { "Id": 3, "ParentId": 1, "Sort": 1, "Name": "菜单1-2" },
    { "Id": 4, "ParentId": 2, "Sort": 2, "Name": "菜单1-1-2" },
    { "Id": 5, "ParentId": 2, "Sort": 1, "Name": "菜单1-1-1" },
    { "Id": 6, "ParentId": null, "Sort": 1, "Name": "菜单2" },
    { "Id": 7, "ParentId": 6, "Sort": 0, "Name": "菜单2-1" },
    { "Id": 8, "ParentId": 6, "Sort": 1, "Name": "菜单2-2" },
    { "Id": 9, "ParentId": 8, "Sort": 2, "Name": "菜单2-2-2" },
    { "Id": 10, "ParentId": 8, "Sort": 1, "Name": "菜单2-2-1" },
    { "Id": 11, "ParentId": 10, "Sort": 0, "Name": "菜单2-2-1-1" }
]





function digui(total, item) {
    if (!total || total.children === 0) return
    for (let obj of total) {
        if (obj.Id === item.ParentId) {
            obj.children = obj.children || []
            // 这里根据Id和ParentId生成children数据
            obj.children.push(item)
            obj.children.sort((a, b) => a.Sort - b.Sort)
        }
        digui(obj.children, item)
    }
}
function genData(menu) {
    return menu.reduce((total, item, index) => {
        if (item.ParentId) {
            digui(total, item)
        } else {
            total.push(item)
        }
        return total
    }, [])
}


// 将上面的数据结果转成
// '<ul><li><ul><li><ul><li><a>菜单1-1-1</a></li></ul><ul><li><a>菜单1-1-2</a></li></ul><a>菜单1-1</a></li></ul><ul><li><a>菜单1-2</a></li></ul><a>菜单1</a></li></ul>'
// 这种格式
