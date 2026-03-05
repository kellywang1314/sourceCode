/**
 * Created by admin on 2018/7/24.
 */
/**给定一个没有重复数字的序列，返回其所有可能的全排列。
 * 示例:
 * 输入: [1,2,3]
 * 输出:
 * [
 *  [1,2,3],
 *  [1,3,2],
 *  [2,1,3],
 *  [2,3,1],
 *  [3,1,2],
 *  [3,2,1]
 * ]
 *
 */


/**采用动态规划的思路解决
 * 假设 nums 前 i-1 项的全排列集合为dp[i - 1]
 * 则前 i 项的全排列共 dp[i - 1].length * i 种
 * 解释： dp[i - 1][0]中插入 nums[i] 共有 i种插入位置， adp[i - 1][0]中每个间隔都可以插入nums[i]
 *
 * @param {number[]} nums
 * @return {number[][]}
 */
function permute(nums) {
    // 存储最终所有排列结果
    const result = [];
    // 存储当前正在构建的单个排列
    const path = [];
    // 标记数组：记录对应索引的元素是否已被使用
    const used = new Array(nums.length).fill(false);

    // 回溯核心函数
    function backtrack() {
        // 终止条件：当前排列长度等于原数组长度，说明生成了一个完整排列
        if (path.length === nums.length) {
            // 拷贝path（因为数组是引用类型，直接push会导致后续修改结果）
            result.push([...path]);
            return;
        }

        // 遍历所有元素，尝试选择未被使用的元素
        for (let i = 0; i < nums.length; i++) {
            // 跳过已被使用的元素
            if (used[i]) continue;

            // 选择当前元素：加入path，标记为已使用
            path.push(nums[i]);
            used[i] = true;

            // 递归：继续构建下一个位置的元素
            backtrack();

            // 回溯：撤销选择，恢复状态（关键步骤）
            path.pop();
            used[i] = false;
        }
    }

    // 启动回溯
    backtrack();
    return result;
}


permute([1, 2, 3, 4, 5])