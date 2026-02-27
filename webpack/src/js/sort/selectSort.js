/**
 * selectSort
 * 选择排序：每一轮在未排序区间选择最小元素，与当前起始位置交换（升序）
 * - 时间复杂度：O(n^2)，空间复杂度：O(1)
 * - 不稳定排序：相等元素可能因交换而改变相对顺序
 * - 当前实现为“升序”：当 `arr[min] > arr[j]` 时更新最小值索引并最终交换
 * @param {number[]} arr 待排序数组，默认示例 `[2,4,5,1,0,9,-1]`
 * @returns {number[]} 排序后的原数组引用
 */
function selectSort(arr = [2, 4, 5, 1, 0, 9, -1]) {
    const len = arr.length - 1
    for (let i = 0; i < len; i++) {
        let min = i
        for (let j = i + 1; j < len; j++) {
            if (arr[min] > arr[j]) {
                min = j
            }
        }
        [arr[i], arr[min]] = [arr[min], arr[i]]
    }
    return arr
}
