/* 
首先计算[A, B, C] * [1, 2, 3]，得到结果[A1, A2, A3, B1, B2, B3]
然后计算[A1, A2, A3, B1, B2, B3] * [X, Y, Z]，得到最终结果[A1X, A1Y, A1Z, A2X, A2Y, A2Z, .... B1X, B1Y, B1Z, ...]
如果还有后续数组，重复上述过程 
*/

let arr = [
    ['A','B'],
    ['a','b'],
    ['1','2']
]

let res = arr.reduce((prev, cur) => {
    const emptyVal = []
    console.log(prev)
    prev.forEach(val => {
        cur.forEach(item => {
            emptyVal.push(`${val}${item}`)
        })
    })
    return emptyVal
})

