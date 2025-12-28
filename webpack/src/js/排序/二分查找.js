
/**
 * Binsearch
 * 二分查找（递归版）：在升序数组中查找目标值的位置
 * - 前提：`arr` 必须已按升序排列
 * - 时间复杂度：O(log n)；空间复杂度：O(log n)（递归栈）
 * @param {number[]} arr 有序数组（升序）
 * @param {number} low 左边界索引
 * @param {number} high 右边界索引
 * @param {number} target 目标值
 * @returns {number} 找到返回目标值的索引；未找到返回 -1
 */
const Binsearch = (arr, low, high, target) => {
    if (low > high) return -1
    let pos = Math.floor((low + high) / 2)
    if (target > arr[pos]) {
        return Binsearch(arr, pos + 1, high, target)
    } else if (target < arr[pos]) {
        return Binsearch(arr, low + 1, pos, target)
    } else {
        return pos
    }
}

// 迭代版本
/**
 * BinsearchIterative
 * 二分查找（迭代版）：在升序数组中查找目标值的位置
 * - 前提：`arr` 必须已按升序排列
 * - 时间复杂度：O(log n)；空间复杂度：O(1)
 * @param {number[]} arr 有序数组（升序）
 * @param {number} target 目标值
 * @returns {number} 找到返回目标值的索引；未找到返回 -1
 */
const BinsearchIterative = (arr, target) => {
    let low = 0, high = arr.length - 1
    while (low <= high) {
        let pos = Math.floor((low + high) / 2)
        if (target > arr[pos]) {
            low = pos + 1
        } else if (target < arr[pos]) {
            high = pos - 1
        } else {
            return pos
        }
    }
    return -1
}