/**
 * binarySearch
 * 在有序数组中查找 target 的下标，未找到返回 -1
 * @param {number[]} nums 有序数组（升序）
 * @param {number} target 目标值
 * @returns {number} 下标或 -1
 */
export function binarySearch(nums, target) {
  let l = 0, r = nums.length - 1
  while (l <= r) {
    const m = (l + r) >> 1
    if (nums[m] === target) return m
    if (nums[m] < target) l = m + 1
    else r = m - 1
  }
  return -1
}

