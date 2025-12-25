// 洗牌算法：原理就是遍历数组元素，将当前元素与随机抽取的一个剩余元素进行交换
function shuffle(arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    for (let i = arr.length - 1; i >= 0; i--) {
        // 没有分号为啥会报错
        let rIndex = Math.floor(Math.random() * (i + 1));
        // 打印交换值
        [arr[i], arr[rIndex]] = [arr[rIndex], arr[i]]
    }
    return arr
}

// splice
function mixSort(list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    // 这里的len是初始值，用来记录循环次数
    const len = list.length
    const newList = []
    for (let i = 0; i < len; i++) {
        let num = Math.floor(Math.random() * (list.length - 1))
        newList.push(list[num])
        // 这里的num是随机抽取的索引，所以要从list中删除，否则会导致重复抽取
        list.splice(num, 1)
    }
    return newList
}


// sort 
var aa = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
function s(a, b) {
    return Math.random() > 0.5 ? 1 : -1
}
aa.sort(s)





