// [1,2,[3,4,[6,7,8]],9]

// 直接调用函数
var arr = [1, [2, 3], [4, [5, 6]]]
var arr_flat = arr.flat(Infinity)


// 递归
var arr = [1, [2, 3], [4, [5, 6]]]
function flat(arr = []) {
    let newArr = [];
    arr.map(item => {
        if (Array.isArray(item)) {
            newArr = [...newArr, ...flat(item)]
        } else {
            newArr = [...newArr, item]
        }
    })
    return newArr
}

// 迭代
function flatten(arr) {
    let temp = [...arr]
    let res = []
    while (temp.length) {
        let item = temp.shift()
        if (Array.isArray(item)) {
            temp.unshift(...item)
        } else {
            res.push(item)
        }
    }
    return res
}


// 递归reduce
function fn(arr) {
    return arr.reduce((res, element) => {
        let temp = Array.isArray(element) ? fn(element) : element
        return res.concat(temp)
    }, [])
}


// toString
var arr = [1, [2, 3], [4, [5, 6]]]
var arr_flat = arr.toString().split(',') //["1", "2", "3", "4", "5", "6"] 字符串类型的
let arr_flat = arr.toString().split(',').map((val) => {
    return parseInt(val)
})

// 正则匹配
JSON.stringify([1, [2, 3], [4, [5, 6]]]).replace(/\[|\]/g, '')


