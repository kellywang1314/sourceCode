/**
 * 
 * @param num int整型一维数组 
 * @param target int整型 
 * @return int整型二维数组
 */
function combinationSum2(num, target) {

    num.sort((a, b) => a - b)
    let tmpArr = []
    let res = []

    dfs(num, target, 0, tmpArr, res, 0)
    return res

}

function dfs(num, target, tmp, tmpArr, res, start) {



    if (tmp == target) {

        let newArr = [...tmpArr]
        res.push(newArr)
        return
    }

    if (start >= num.length) return

    for (let i = start; i < num.length; ++i) {

        if (i > start && num[i] == num[i - 1]) continue
        let n = num[i]
        if ((tmp + n) <= target) {
            tmp = tmp + n
            tmpArr.push(n)
            dfs(num, target, tmp, tmpArr, res, i + 1)
            tmpArr.pop()
            tmp = tmp - n
        }


    }

}
