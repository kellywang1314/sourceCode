// arr = [[12,2],[23,5],[55,67],[12,23]]

// 第一种方式
function concat2(arr) {
    return arr.reduce(function (x, y) {
        return x.concat(y)
    }).sort(function (a, b) {
        return a - b
    })
}

// 归并排序
function merge(num = []) {
    num = num.flat()
    if (num.length < 2) return num
    let mid = Math.floor(num.length / 2)
    let leftArr = num.slice(0, mid)
    let rightArr = num.slice(mid)
    return mergeSort(merge(leftArr), merge(rightArr))

}

function mergeSort(left, right) {
    let res = []
    while (left.length && right.length) {
        if (left[0] < right[0]) {
            if (!res.includes(left[0])) {
                res.push(left.shift())
            }
        } else {
            if (!res.includes(right[0])) {
                res.push(right.shift())
            }
        }
    }
    while (left.length) {
        if (!res.includes(left[0])) {
            res.push(left.shift())
        }
    }
    while (right.length) {
        if (!res.includes(right[0])) {
            res.push(right.shift())
        }
    }
    return res
}


merge([[12, 21], [5, 23], [55, 67]])
