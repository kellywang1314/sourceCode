/**
 * 背包问题总览与解题思路
 * 目标：梳理 0-1 背包、完全背包、多重背包及常见变体的统一解题框架，提供可直接复用的模板。
 *
 * 一般 DP 解题思路（适用于多数背包题）：
 * 1. 明确问题类型：
 *    - 0-1 背包：每件物品最多选一次（容量循环倒序）
 *    - 完全背包：每件物品可无限次选用（容量循环正序）
 *    - 多重背包：每件物品最多选 k 次（可用二进制分组转 0-1 背包）
 *    - 变体：可行性（布尔）、最优值（数值、最大/最小）、计数（方案数）、多维约束等
 * 2. 定义状态：
 *    - 二维：dp[i][c] 表示前 i 件物品、容量 c 下的最优/可行/计数
 *    - 一维压缩：dp[c] 表示容量 c 下的最优/可行/计数（按题型选择正/倒序）
 * 3. 初始化：
 *    - 可行性：dp[0] = true（容量 0 可行）
 *    - 最优值：dp[*] = 0（最大值问题）或 Infinity（最小值问题）
 *    - 计数：dp[0] = 1（凑出 0 的方案数为 1：空集）
 * 4. 转移方程（以 0-1 背包最大值为例）：
 *    - dp[c] = max(dp[c], dp[c - w] + v)（容量 c ≥ 物品重量 w）
 *    - 完全背包：容量正序 c = w..C；0-1 背包：容量倒序 c = C..w
 * 5. 遍历顺序：
 *    - 0-1 背包：物品外层，容量倒序（避免重复选同一物品）
 *    - 完全背包：物品外层，容量正序（允许重复）
 *    - 计数问题（组合 vs 排列）：
 *      - 组合数（顺序不敏感）：物品外层，容量内层正序
 *      - 排列数（顺序敏感）：容量外层，物品内层正序
 * 6. 返回值：根据题意选择 dp[capacity] 或布尔/计数目标位
 */

/**
 * 0-1 背包（二维 DP）
 * 思路：dp[i][c] 表示前 i 件物品、容量 c 的最大价值；每件物品最多选一次。
 * @param {number[]} weights - 每件物品的重量
 * @param {number[]} values - 每件物品的价值
 * @param {number} capacity - 背包容量
 * @returns {number} - 最大价值
 */
function zeroOneKnapsack2D(weights, values, capacity) {
    const n = weights.length;
    const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
    for (let i = 1; i <= n; i++) {
        const w = weights[i - 1], v = values[i - 1];
        for (let c = 0; c <= capacity; c++) {
            dp[i][c] = dp[i - 1][c];
            if (c >= w) dp[i][c] = Math.max(dp[i][c], dp[i - 1][c - w] + v);
        }
    }
    return dp[n][capacity];
}

/**
 * 0-1 背包（一维压缩）
 * 思路：用一维 dp[c] 压缩空间；容量倒序避免同一物品被重复使用。
 * @param {number[]} weights
 * @param {number[]} values
 * @param {number} capacity
 * @returns {number}
 */
function zeroOneKnapsack1D(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(capacity + 1).fill(0);
    for (let i = 0; i < n; i++) {
        const w = weights[i], v = values[i];
        for (let c = capacity; c >= w; c--) {
            dp[c] = Math.max(dp[c], dp[c - w] + v);
        }
    }
    return dp[capacity];
}

/**
 * 完全背包（无限次取用）
 * 思路：容量正序遍历，允许同一物品在同一层被多次取用。
 * @param {number[]} weights
 * @param {number[]} values
 * @param {number} capacity
 * @returns {number}
 */
function completeKnapsack(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(capacity + 1).fill(0);
    for (let i = 0; i < n; i++) {
        const w = weights[i], v = values[i];
        for (let c = w; c <= capacity; c++) {
            dp[c] = Math.max(dp[c], dp[c - w] + v);
        }
    }
    return dp[capacity];
}



/**
 * 多重背包（每件物品最多取 count 次）
 * 思路：二进制分组（Binary Splitting）把多重背包转化为若干件 0-1 物品。
 * @param {number[]} weights
 * @param {number[]} values
 * @param {number[]} counts - 每件物品的最多可取次数
 * @param {number} capacity
 * @returns {number}
 */
function multipleKnapsack(weights, values, counts, capacity) {
    const newWeights = [];
    const newValues = [];
    for (let i = 0; i < weights.length; i++) {
        let k = counts[i];
        let base = 1;
        while (k > 0) {
            const take = Math.min(base, k);
            newWeights.push(weights[i] * take);
            newValues.push(values[i] * take);
            k -= take;
            base <<= 1;
        }
    }
    return zeroOneKnapsack1D(newWeights, newValues, capacity);
}

/**
 * 子集和（是否能凑出恰好 target）
 * 思路：布尔型 0-1 背包；dp[s] 表示是否能凑出和 s；容量倒序避免重复使用。
 * @param {number[]} nums - 正整数数组
 * @param {number} target - 目标和
 * @returns {boolean} - 是否存在子集使其和为 target
 */
function subsetSumExists(nums, target) {
    const dp = Array(target + 1).fill(false);
    dp[0] = true;
    for (const num of nums) {
        for (let s = target; s >= num; s--) {
            dp[s] = dp[s] || dp[s - num];
        }
    }
    return dp[target];
}

/**
 * 分割等和子集（LeetCode 416）
 * 思路：总和 sum 一半为目标；转化为子集和可行性：subsetSumExists(nums, sum/2)。
 * @param {number[]} nums
 * @returns {boolean}
 */
function partitionEqualSubsetSum(nums) {
    const sum = nums.reduce((a, b) => a + b, 0);
    if (sum % 2 !== 0) return false;
    return subsetSumExists(nums, sum >> 1);
}

/**
 * 零钱兑换（最少硬币数，LeetCode 322）
 * 思路：完全背包的最优化；dp[a] 为凑出金额 a 的最少硬币数，初始化为 Infinity，dp[0]=0。
 * @param {number[]} coins - 硬币面额
 * @param {number} amount - 目标金额
 * @returns {number} - 最少硬币数，不可达返回 -1
 */
function coinChangeMinCoins(coins, amount) {
    const dp = Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (const coin of coins) {
        for (let a = coin; a <= amount; a++) {
            dp[a] = Math.min(dp[a], dp[a - coin] + 1);
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
}

/**
 * 零钱兑换 II（组合数，LeetCode 518）
 * 思路：完全背包的计数问题；物品外层、容量内层正序，避免排列重复，统计组合数。
 * @param {number[]} coins
 * @param {number} amount
 * @returns {number} - 不同组合数量（不计排列）
 */
function coinChangeWays(coins, amount) {
    const dp = Array(amount + 1).fill(0);
    dp[0] = 1;
    for (const coin of coins) {
        for (let a = coin; a <= amount; a++) {
            dp[a] += dp[a - coin];
        }
    }
    return dp[amount];
}

/**
 * 目标和（LeetCode 494）
 * 思路：设把部分数取正号的和为 P，总和 S，则 P = (S + target)/2；转化为 0-1 背包计数：凑出和为 P 的方案数。
 * @param {number[]} nums
 * @param {number} target
 * @returns {number} - 方法数
 */
function targetSumWays(nums, target) {
    const sum = nums.reduce((a, b) => a + b, 0);
    if ((sum + target) % 2 !== 0) return 0;
    const pos = (sum + target) >> 1;
    if (pos < 0) return 0;
    const dp = Array(pos + 1).fill(0);
    dp[0] = 1;
    for (const num of nums) {
        for (let s = pos; s >= num; s--) {
            dp[s] += dp[s - num];
        }
    }
    return dp[pos];
}

/**
 * 一和零（双维度 0-1 背包，LeetCode 474）
 * 思路：dp[i][j] 表示最多用 i 个 0、j 个 1 时可选的最大字符串数量；双维度容量倒序。
 * @param {string[]} strs - 字符串集合
 * @param {number} m - 可用的 0 的数量
 * @param {number} n - 可用的 1 的数量
 * @returns {number} - 最大可选数量
 */
function onesAndZeroes(strs, m, n) {
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (const s of strs) {
        const zeros = [...s].filter(ch => ch === '0').length;
        const ones = s.length - zeros;
        for (let i = m; i >= zeros; i--) {
            for (let j = n; j >= ones; j--) {
                dp[i][j] = Math.max(dp[i][j], dp[i - zeros][j - ones] + 1);
            }
        }
    }
    return dp[m][n];
}

// 题目映射与使用建议（摘要，供快速参考）
// - 0-1：416 分割等和子集、494 目标和、474 一和零
// - 完全：322 最少硬币、518 硬币组合、279 完全平方数（同 322 模板）
// - 计数：组合 vs 排列区分遍历顺序；组合用物品外层、容量正序
// - 多维：双维度容量倒序以避免同一项重复
// - 常见坑：最小值类初始化为 Infinity；布尔/计数类初始化 dp[0]=true/1

/**
 * 分割等和子集（Hot 100 便捷函数，LeetCode 416）
 * 功能：判断能否将数组分成两个和相等的子集。
 * 思路：0-1 背包可行性判定；目标为 sum/2；容量倒序布尔 DP。
 * @param {number[]} nums - 输入数组
 * @returns {boolean} - 是否可分割
 */
function canPartition(nums) {
    const sum = nums.reduce((a, b) => a + b, 0);
    if (sum % 2 !== 0) return false;
    const target = sum >> 1;
    const dp = Array(target + 1).fill(false);
    dp[0] = true;
    for (const num of nums) {
        for (let s = target; s >= num; s--) {
            dp[s] = dp[s] || dp[s - num];
        }
    }
    return dp[target];
}


/**
 * 完全平方数（LeetCode 279）
 * 函数功能：给定正整数 n，求若干个完全平方数之和等于 n 的最少数量。
 * 算法思路：完全背包的最优化问题。定义 dp[i] 为凑出和 i 的最少平方数个数。
 * 初始化：dp[0] = 0（凑出 0 需要 0 个）；其余通过转移得到。
 * 转移：对于每个 i，从所有不超过 i 的平方数 j*j 中选择最后一个，
 *       dp[i] = 1 + min(dp[i - j*j])，其中 j*j <= i。
 * 复杂度：时间 O(n * sqrt(n))，空间 O(n)。
 */
var numSquares = function(n) {
    let dp = new Array(n + 1).fill(0) // dp[i] 表示凑出 i 的最少平方数个数
    for (let i = 1; i <= n; i++) {
        let minn = Infinity; // 本轮最优（最少个数）
        for (let j = 1; j * j <= i; j++) { // 枚举最后使用的平方数 j*j
            minn = Math.min(minn, dp[i - j * j]); // 选择使剩余 i - j*j 的最少方案
        }
        dp[i] = minn + 1; // 加上当前选的 j*j 这一枚
    }
    return dp[n]; // 返回凑出 n 的最少平方数个数
};

// 可选导出
module.exports = {
    zeroOneKnapsack2D,
    zeroOneKnapsack1D,
    completeKnapsack,
    multipleKnapsack,
    subsetSumExists,
    partitionEqualSubsetSum,
    canPartition,
    coinChangeMinCoins,
    coinChangeWays,
    targetSumWays,
    onesAndZeroes,
    numSquares
};
