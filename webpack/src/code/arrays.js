/**
 * twoSum
 * 返回数组中两数之和为 target 的下标
 * @param {number[]} nums 输入数组
 * @param {number} target 目标和
 * @returns {[number, number] | null} 两个下标或 null
 */
function twoSum(arr = [], target) {
    if (arr.length < 2) return []
    const res = []
    const obj = {}
    for (let i = 0; i < arr.length; i++) {
        if (obj[target - arr[i]] !== undefined) {
            res.push([arr[i], target - arr[i]])
        } else {
            obj[arr[i]] = target - arr[i]
        }
    }
    return res
}

/**
 * maxSubArray
 * 最大子数组和（Kadane 算法）
 * @param {number[]} nums 输入数组
 * @returns {number} 最大和
 */
export function maxSubArray(nums) {
    let best = -Infinity
    let cur = 0
    for (const n of nums) {
        cur = Math.max(n, cur + n)
        best = Math.max(best, cur)
    }
    return best
}

/**
 * moveZeroes
 * 将数组中的 0 移到末尾，保持非零元素相对顺序
 * @param {number[]} nums 输入数组（原地修改）
 * @returns {number[]} 修改后的数组
 */
export function moveZeroes(nums) {
    let slow = 0
    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== 0) {
            [nums[slow], nums[fast]] = [nums[fast], nums[slow]]
            slow++
        }
    }
    return nums
}

/**
 * mergeIntervals
 * 合并区间，返回合并后的区间列表
 * @param {Array<[number, number]>} intervals 区间列表
 * @returns {Array<[number, number]>} 合并结果
 */
export function mergeIntervals(intervals) {
    if (!intervals.length) return []
    intervals.sort((a, b) => a[0] - b[0])
    const res = [intervals[0].slice()]
    for (let i = 1; i < intervals.length; i++) {
        const [start, end] = intervals[i]
        const last = res[res.length - 1]
        if (start <= last[1]) {
            last[1] = Math.max(last[1], end)
        } else {
            res.push([start, end])
        }
    }
    return res
}

