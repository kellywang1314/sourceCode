// 插入排序  O(n^2) 稳定
/**
 * insertSort
 * 插入排序：通过逐步将元素插入到已排序子序列的正确位置来完成排序
 * - 稳定排序：相等元素的相对顺序保持不变
 * - 时间复杂度：平均/最坏均为 O(n^2)，空间复杂度 O(1)
 * - 当前实现按“降序”排列（当 `arr[j] < arr[j+1]` 时交换），如需升序可改为 `arr[j] > arr[j+1]`
 * @param {number[]} arr 待排序数组，默认示例 `[0, -1, 4, 9, 2, 1, 4]`
 * @returns {number[]} 排序后的原数组引用
 */
function insertSort(arr = [0, -1, 4, 9, 2, 1, -1, 4]) {
    let len = arr.length
    for (let i = 0; i < len; i++) {
        for (let j = i; j >= 0; j--) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            }
        }
    }
    return arr
}

