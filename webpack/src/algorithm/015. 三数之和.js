/**
 * Created by admin on 2018/6/2.
 */
/**给定一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？找出所
 * 有满足条件且不重复的三元组。
 *
 * 注意：答案中不可以包含重复的三元组。
 * 例如, 给定数组 nums = [-1, 0, 1, 2, -1, -4]，
 * 满足要求的三元组集合为：
 * [
 *  [-1, 0, 1],
 *  [-1, -1, 2]
 * ]
 *
 */
// 排序：先对数组进行排序，这是去重和双指针法的基础。
// 遍历 + 双指针：固定一个数 nums[i]，然后用左指针 left = i+1、右指针 right = nums.length-1 寻找另外两个数，使三者之和为 0。
// 去重：在遍历和移动指针的过程中，跳过重复的元素，避免生成重复的三元组。

/**
 * 三数之和：找出数组中所有和为0的不重复三元组
 * @param {number[]} nums 输入数组
 * @returns {number[][]} 符合条件的三元组数组
 */
function threeSum(nums) {
  // 结果数组
  const result = [];
  // 处理边界情况：数组长度小于3直接返回空
  if (nums.length < 3) return result;

  // 1. 排序（关键：方便双指针移动和去重）
  nums.sort((a, b) => a - b);

  // 2. 遍历固定第一个数
  for (let i = 0; i < nums.length; i++) {
    // 优化：如果第一个数大于0，后面的数都≥它，和不可能为0，直接退出
    if (nums[i] > 0) break;

    // 去重：跳过和前一个数相同的元素（避免重复三元组）
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    // 定义双指针
    let left = i + 1;
    let right = nums.length - 1;

    // 3. 移动双指针找另外两个数
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum === 0) {
        // 找到符合条件的三元组，加入结果
        result.push([nums[i], nums[left], nums[right]]);

        // 去重：跳过左侧重复元素
        while (left < right && nums[left] === nums[left + 1]) left++;
        // 去重：跳过右侧重复元素
        while (left < right && nums[right] === nums[right - 1]) right--;

        // 移动指针继续寻找
        left++;
        right--;
      } else if (sum < 0) {
        // 和太小，左指针右移增大数值
        left++;
      } else {
        // 和太大，右指针左移减小数值
        right--;
      }
    }
  }

  return result;
}

// 测试用例
const testCase1 = [-1, 0, 1, 2, -1, -4];
console.log(threeSum(testCase1)); // 输出：[[-1,-1,2],[-1,0,1]]

const testCase2 = [0, 0, 0];
console.log(threeSum(testCase2)); // 输出：[[0,0,0]]

const testCase3 = [1, 2, -2, -1];
console.log(threeSum(testCase3)); // 输出：[]