// 复杂度是o(n)
/**
 * findKth
 * 使用快速选择（Quickselect）在平均 O(n) 时间找到数组中的第 K 大元素
 * - 思路：通过一次分区确定一个枢轴的最终位置，判断其相对排名与 K 的关系
 * - 若枢轴排名等于 K，直接返回；否则在对应子区间继续递归选择
 * @param {number[]} a 输入数组
 * @param {number} K 第 K 大，K 为 1 基（K=1 表示最大值）
 * @returns {number} 第 K 大的数值
 */
function findKth(a, K) {
    return quickSort(a, 0, a.length - 1, K)
}

/**
 * quickSort
 * 快速选择的递归过程：根据分区结果选择继续在左/右子区间查找
 * - 本实现以“降序”分区，使枢轴左侧元素不小于枢轴，右侧元素不大于枢轴
 * @param {number[]} a 数组
 * @param {number} low 起始下标
 * @param {number} high 结束下标
 * @param {number} K 子数组范围内第 K 大目标（1 基）
 * @returns {number} 第 K 大的数值
 */
function quickSort(a, low, high, K) {
    let p = partion(a, low, high)
    const rank = p - low + 1
    if (rank === K) {
        return a[p]
    } else if (rank > K) {
        return quickSort(a, low, p - 1, K)
    } else {
        return quickSort(a, p + 1, high, K - rank)
    }
}

/**
 * partion
 * 分区：将枢轴 `a[low]` 放到其最终位置，并保证
 * - 左侧区间元素 >= 枢轴（用于“第 K 大”需求）
 * - 右侧区间元素 <= 枢轴
 * @param {number[]} a 数组
 * @param {number} low 起始下标（同时作为枢轴初始位置）
 * @param {number} high 结束下标
 * @returns {number} 枢轴最终索引
 */
function partion(a, low, high) {
    const pivotIndex = low + Math.floor(Math.random() * (high - low + 1))
    const pivotValue = a[pivotIndex]
        ;[a[pivotIndex], a[high]] = [a[high], a[pivotIndex]]
    let storeIndex = low
    for (let i = low; i < high; i++) {
        if (a[i] >= pivotValue) {
            ;[a[storeIndex], a[i]] = [a[i], a[storeIndex]]
            storeIndex++
        }
    }
    ;[a[storeIndex], a[high]] = [a[high], a[storeIndex]]
    return storeIndex
}
