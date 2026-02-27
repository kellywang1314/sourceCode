// O(n^2) 稳定
/**
 * bubbleSort 基础版
 * 冒泡排序：通过相邻元素比较与交换，将最大（或最小）元素逐步“冒泡”到边界
 * - 稳定排序：相等元素的相对顺序保持不变
 * - 时间复杂度：平均/最坏 O(n^2)，空间复杂度 O(1)
 * - 当前实现为“升序”：当 `arr[j] > arr[j+1]` 时交换
 * - 说明：内层循环边界为 `j < len - i`，可更严谨为 `j < len - 1 - i`
 * @param {number[]} arr 待排序数组
 * @returns {number[]} 排序后的原数组引用
 */
function BubbleSort(arr) {
    let len = arr.length
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            }
        }
    }
    return arr
}

// 增加标示位
/**
 * bubbleSort2 优化版
 * 使用“最后交换位置”的标示位优化外层边界，减少不必要比较
 * - 每趟记录最后一次交换的索引 `flag`，下一趟只需扫描到该位置
 * - 适合部分已排序数组，能显著减少比较次数
 * @param {number[]} arr 待排序数组
 * @returns {number[]} 排序后的原数组引用
 */
function bubbleSortOptimized(arr) {
    let len = arr.length
    if (len <= 1) return arr
    for (let n = len; n > 0;) {
        let lastSwap = 0
        for (let j = 0; j < n - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
                lastSwap = j + 1
            }
        }
        n = lastSwap
    }
    return arr
}

