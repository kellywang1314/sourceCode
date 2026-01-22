// 归并排序 时间复杂度o(nlogn) 空间复杂度o(n) 稳定

/**
 * merge
 * 归并子过程：将两个已排序的数组合并为一个有序数组（升序）
 * - 稳定：当元素相等时优先选择左侧，保持相对顺序
 * - 时间复杂度 O(n)，空间复杂度 O(n)
 * @param {number[]} left 左半部分（已排序）
 * @param {number[]} right 右半部分（已排序）
 * @returns {number[]} 合并后的有序数组
 */
function merge(left, right) {
    let result = [];
    while (left.length && right.length) {
        if (left[0] < right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
    return result.concat(left).concat(right);
}

/**
 * mergeSort
 * 归并排序：分治 + 合并，两两有序合并得到整体有序
 * - 时间复杂度 O(n log n)，空间复杂度 O(n)
 * - 稳定排序，适用于需要稳定性的场景（如按多个字段排序）
 * @param {number[]} arr 待排序数组（升序）
 * @returns {number[]} 排序后的新数组
 */
function mergeSort(arr = []) {
    const len = arr.length
    if (len < 2) return arr
    const mid = Math.floor(len / 2)
    const left = arr.slice(0, mid)
    const right = arr.slice(mid)
    return merge(mergeSort(left), mergeSort(right))
}

/**
 * demoMergeSortBasic
 * 基础用例：演示一般数组排序效果
 * @returns {void}
 */
function demoMergeSortBasic() {
    const arr = [5, 2, 4, 1, 3]
    console.log('mergeSort basic input:', arr.slice())
    console.log('mergeSort basic output:', mergeSort(arr))
}

/**
 * demoMergeSortEdgeCases
 * 边界用例：空数组与单元素数组
 * @returns {void}
 */
function demoMergeSortEdgeCases() {
    const empty = []
    const single = [42]
    console.log('mergeSort empty:', mergeSort(empty))
    console.log('mergeSort single:', mergeSort(single))
}

/**
 * demoMergeSortDuplicates
 * 重复元素用例：包含多次出现的数值
 * @returns {void}
 */
function demoMergeSortDuplicates() {
    const arr = [3, 1, 2, 2, 3]
    console.log('mergeSort duplicates input:', arr.slice())
    console.log('mergeSort duplicates output:', mergeSort(arr))
}
