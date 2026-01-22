var list = [
    { name: '上海', code: 'shanghai', },
    { name: '西安', code: 'xian' },
    { name: '深圳', code: 'shenzhen' },
    { name: '北京', code: 'beijing' }
];
list.sort((a, b) => {
    let order = ['beijing', 'xian', 'shanghai', 'shenzhen'];
    return order.indexOf(a.code) - order.indexOf(b.code);
});

/**
 * twoSum: 两数之和
 * 在数组中查找一对数，使其和等于给定目标值；返回该对数的“值对”（非下标）
 * - 使用哈希表保存已遍历元素，查找当前元素的补数 `target - x`
 * - 时间复杂度 O(n)，空间复杂度 O(n)
 * - 若不存在满足条件的对数，返回空数组
 * @param {number[]} arr 输入数组
 * @param {number} target 目标和
 * @returns {number[]} 找到返回 `[x, y]`（值对），未找到返回 `[]`
 */
function twoSum(arr = [], target) {
    let map = {}
    for (let i in arr) {
        if (map[target - arr[i]] !== undefined) {
            return [arr[i], map[target - arr[i]]]
        } else {
            map[arr[i]] = arr[i]
        }
    }
    return []
}

/**
 * demoTwoSum
 * twoSum 用例：展示常见输入的返回结果
 * @returns {void}
 */
function demoTwoSum() {
    const a1 = [2, 7, 11, 15]
    console.log('twoSum([2,7,11,15], 9) =>', twoSum(a1, 9)) // 可能返回 [7,2] 或 [2,7]

    const a2 = [3, 3]
    console.log('twoSum([3,3], 6) =>', twoSum(a2, 6)) // [3,3]

    const a3 = [1, 2, 4, 5]
    console.log('twoSum([1,2,4,5], 10) =>', twoSum(a3, 10)) // [] 不存在
}
