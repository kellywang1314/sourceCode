//快排 O(nlogn)， 不稳定
/**
 * quickSort
 * 快速排序（递归版）：选择枢轴，将数组划分为小于枢轴与大于等于枢轴两部分，递归排序后合并
 * - 平均时间复杂度 O(n log n)，最坏 O(n^2)；空间复杂度取决于递归深度，平均 O(log n)
 * - 本实现使用“取中间索引并 splice 取枢轴”的方式，`splice` 会修改原数组
 * - 返回升序结果：左侧 `low` 存放小于枢轴的元素，右侧 `high` 存放大于等于枢轴的元素
 * @param {number[]} arr 待排序数组
 * @returns {number[]} 排序后的新数组（由递归结果拼接产生）
 */
function quickSort(arr = []) {
    if (arr.length <= 1) return arr
    let pos = Math.floor(arr.length / 2)
    let posvalue = arr.splice(pos, 1)[0]
    let low = [], high = []
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < posvalue) {
            low.push(arr[i])
        } else {
            high.push(arr[i])
        }
    }
    return [...quickSort(low), posvalue, ...quickSort(high)]

}
