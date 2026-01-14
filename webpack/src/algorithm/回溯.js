// 回溯的模版
//  backtrack(参数) {
//     if (终止条件) {
//         存放结果;
//         return;
//     }
//     for (选择 : 本层集合中的元素) {
//         处理节点;
//         backtracking(路径, 选择列表); // 递归
//         撤销处理; // 回溯
//     }
// }

/**
 * Hot 100 回溯题目集合
 * 说明：本文件汇总实现 LeetCode Hot 100 中典型的回溯题目，所有函数与变量均使用驼峰命名。
 * 使用：按需调用对应函数，函数级注释已标注入参、返回值与思路。
 */

/**
 * 17. 电话号码的字母组合
 * 思路：回溯逐位选择字母，路径为当前已拼接的字符串。
 * @param {string} digits - 仅包含数字 2-9 的字符串
 * @returns {string[]} - 所有可能的字母组合
 */
// 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。

function letterCombinationsExplicit(digits) {
    const digitMap = {
        2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl',
        6: 'mno', 7: 'pqrs', 8: 'tuv', 9: 'wxyz'
    };
    const result = [];
    if (!digits || digits.length === 0) return result;

    const pathArr = [];
    function backtrack(index) {
        if (index === digits.length) {
            result.push(pathArr.join(''));
            return;
        }
        const letters = digitMap[digits[index]];
        for (let i = 0; i < letters.length; i++) {
            pathArr.push(letters[i]);     // 选择
            backtrack(index + 1);         // 递归
            pathArr.pop();                // 撤销
        }
    }

    backtrack(0);
    return result;
}

/**
 * 22. 括号生成
 * 思路：用回溯控制左/右括号数量，保证任意前缀右括号不超过左括号。
 * @param {number} n - 括号对数
 * @returns {string[]} - 所有有效括号组合
 */
// 数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。
function generateParentheses(n) {
    const result = [];

    function backtrack(path, leftCount, rightCount) {
        if (path.length === 2 * n) {
            result.push(path);
            return;
        }
        if (leftCount < n) {
            backtrack(path + '(', leftCount + 1, rightCount);
        }
        if (rightCount < leftCount) {
            backtrack(path + ')', leftCount, rightCount + 1);
        }
    }

    backtrack('', 0, 0);
    return result;
}

/**
 * 39. 组合总和
 * 思路：排序+回溯，允许重复选取同一元素，使用目标值递减剪枝。
 * @param {number[]} candidates - 候选集合（正整数）
 * @param {number} target - 目标和
 * @returns {number[][]} - 所有组合（元素可重复使用）
 */
/**
 * 39. 组合总和
 * 函数功能：在 candidates 中找到所有元素可重复选取、和为 target 的组合。
 * 算法：排序 + 回溯 + 剪枝（当 val > remain 时提前终止）。
 * 参数：
 * - candidates: number[] 候选集合（正整数，允许重复选取同一元素）
 * - target: number 目标和
 * 返回：number[][] 所有满足的组合（每个组合内部按非降序）
 * 复杂度：
 * - 时间：受解空间影响为指数级；排序开销 O(n log n)
 * - 空间：递归深度与路径存储约 O(target / minVal)
 * 关键点：
 * - startIndex 不前进保持在 i，表示可重复选择同一元素
 * - remain 表示还需凑的目标值，递归时递减
 * - 使用 val > remain 剪枝，避免无效搜索
 */
// 给你一个 无重复元素 的整数数组 candidates 和一个目标整数 target ，找出 candidates 中可以使数字和为目标数 target 的 所有 不同组合 ，并以列表形式返回。你可以按 任意顺序 返回这些组合。
// candidates 中的 同一个 数字可以 无限制重复被选取 。如果至少一个数字的被选数量不同，则两种组合是不同的。 
// 对于给定的输入，保证和为 target 的不同组合数少于 150 个。
function combinationSum(candidates, target) {
    const nums = candidates.slice().sort((a, b) => a - b);
    const result = [];

    function backtrack(startIndex, remain, path) {
        if (remain === 0) {
            result.push(path.slice());
            return;
        }
        for (let i = startIndex; i < nums.length; i++) {
            const val = nums[i];
            if (val > remain) break;
            path.push(val);
            backtrack(i, remain - val, path);
            path.pop();
        }
    }

    backtrack(0, target, []);
    return result;
}

/**
 * 40. 组合总和 II
 * 思路：排序+回溯，每个元素最多使用一次，同层去重（跳过相同值）。
 * @param {number[]} candidates - 候选集合（可能有重复）
 * @param {number} target - 目标和
 * @returns {number[][]} - 所有不重复组合（元素只能用一次）
 */
function combinationSum2(candidates, target) {
    const nums = candidates.slice().sort((a, b) => a - b);
    const result = [];

    function backtrack(startIndex, remain, path) {
        if (remain === 0) {
            result.push(path.slice());
            return;
        }
        for (let i = startIndex; i < nums.length; i++) {
            if (i > startIndex && nums[i] === nums[i - 1]) continue;
            const val = nums[i];
            if (val > remain) break;
            path.push(val);
            backtrack(i + 1, remain - val, path);
            path.pop();
        }
    }

    backtrack(0, target, []);
    return result;
}

/**
 * 46. 全排列
 * 思路：回溯+标记数组 used，逐个选择未使用的元素构建路径。
 * @param {number[]} nums - 无重复整数数组
 * @returns {number[][]} - 所有排列
 */
function permute(nums) {
    const result = [];
    const used = new Array(nums.length).fill(false);

    function backtrack(path) {
        if (path.length === nums.length) {
            result.push(path.slice());
            return;
        }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.push(nums[i]);
            backtrack(path);
            path.pop();
            used[i] = false;
        }
    }

    backtrack([]);
    return result;
}

/**
 * 47. 全排列 II
 * 思路：排序+回溯+去重。若 nums[i] == nums[i-1] 且前一个未使用，则跳过保证唯一性。
 * @param {number[]} nums - 可能含重复的整数数组
 * @returns {number[][]} - 不含重复的所有排列
 */
function permuteUnique(nums) {
    const arr = nums.slice().sort((a, b) => a - b);
    const result = [];
    const used = new Array(arr.length).fill(false);

    function backtrack(path) {
        if (path.length === arr.length) {
            result.push(path.slice());
            return;
        }
        for (let i = 0; i < arr.length; i++) {
            if (used[i]) continue;
            if (i > 0 && arr[i] === arr[i - 1] && !used[i - 1]) continue;
            used[i] = true;
            path.push(arr[i]);
            backtrack(path);
            path.pop();
            used[i] = false;
        }
    }

    backtrack([]);
    return result;
}

/**
 * 78. 子集
 * 思路：回溯枚举所有长度的子集；每层先记录当前路径，再向后选择。
 * @param {number[]} nums - 无重复整数数组
 * @returns {number[][]} - 所有子集
 */
function subsets(nums) {
    const result = [];

    function backtrack(startIndex, path) {
        result.push(path.slice());
        for (let i = startIndex; i < nums.length; i++) {
            path.push(nums[i]);
            backtrack(i + 1, path);
            path.pop();
        }
    }

    backtrack(0, []);
    return result;
}

/**
 * 90. 子集 II
 * 思路：排序+回溯，同层去重避免相同子集。
 * @param {number[]} nums - 可能含重复的整数数组
 * @returns {number[][]} - 不重复子集
 */
function subsetsWithDup(nums) {
    const arr = nums.slice().sort((a, b) => a - b);
    const result = [];

    function backtrack(startIndex, path) {
        result.push(path.slice());
        for (let i = startIndex; i < arr.length; i++) {
            if (i > startIndex && arr[i] === arr[i - 1]) continue;
            path.push(arr[i]);
            backtrack(i + 1, path);
            path.pop();
        }
    }

    backtrack(0, []);
    return result;
}

/**
 * 79. 单词搜索
 * 函数功能：判断在字符矩阵 board 中是否存在一条路径，能按顺序拼出单词 word。
 * 算法：DFS + 回溯，四方向搜索，使用原地标记避免重复访问。
 * 参数：
 * - board: character[][] 字符矩阵
 * - word: string 目标单词
 * 返回：boolean 若存在路径返回 true，否则返回 false
 * 复杂度：
 * - 时间：O(m*n*4^L)，m*n 为网格规模，L 为 word 长度
 * - 空间：O(L) 递归深度（不含输入）
 * 关键点：
 * - 进入格子后先暂存原值并标记访问，递归完成后恢复（回溯）
 * - 越界与字符不匹配时立即剪枝返回
 */
function exist(board, word) {
    const rows = board.length; // 行数
    const cols = rows ? board[0].length : 0; // 列数
    if (!rows || !cols) return false; // 空矩阵直接返回

    function dfs(r, c, index) { // 在 (r,c) 位置尝试匹配 word[index...]
        if (index === word.length) return true; // 全部匹配完成
        if (r < 0 || r >= rows || c < 0 || c >= cols) return false; // 越界剪枝
        if (board[r][c] !== word[index]) return false; // 字符不匹配剪枝

        const temp = board[r][c]; // 暂存当前字符
        board[r][c] = '#'; // 标记为已访问，防止重复使用
        const found =
            dfs(r + 1, c, index + 1) || // 下
            dfs(r - 1, c, index + 1) || // 上
            dfs(r, c + 1, index + 1) || // 右
            dfs(r, c - 1, index + 1);   // 左
        board[r][c] = temp; // 回溯：恢复原值
        return found;
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (dfs(r, c, 0)) return true; // 任一起点成功即返回
        }
    }
    return false; // 遍历所有起点仍失败
}

/**
 * 131. 分割回文串
 * 函数功能：将字符串 s 分割为所有可能的回文子串组合。
 * 算法：回溯枚举分割位置 + 双指针回文判断，无记忆化。
 * 参数：
 * - s: string 输入字符串
 * 返回：string[][] 每个结果为一组分割方案（每段均为回文）
 * 复杂度：
 * - 时间：近似 O(n * 2^n)，回文检查每次 O(k) 增加常数；最坏情况可达 O(n^3)
 * - 空间：O(n) 递归栈与路径存储（不含输出）
 * 关键点：
 * - startIndex 表示下一段的起始位置
 * - end 从 startIndex 到末尾枚举分割点，遇到回文则加入路径继续递归
 * - 使用 path.push / path.pop 实现选择与撤销（回溯）
 */
function partition(s) {
    const result = []; // 收集所有分割方案

    function isPalindrome(str, left, right) { // 判断 str[left..right] 是否回文
        while (left < right) {
            if (str[left] !== str[right]) return false; // 双指针不相等则非回文
            left++;
            right--;
        }
        return true; // 左右指针交叉，说明是回文
    }

    function backtrack(startIndex, path) { // 回溯：从 startIndex 开始尝试切分
        if (startIndex === s.length) { // 终止条件：已切分到字符串末尾
            result.push(path.slice()); // 保存当前路径的副本
            return;
        }
        for (let end = startIndex; end < s.length; end++) { // 枚举当前段的结束位置
            if (isPalindrome(s, startIndex, end)) { // 剪枝：仅在回文时继续
                path.push(s.slice(startIndex, end + 1)); // 选择当前回文段
                backtrack(end + 1, path); // 递归到下一段起点
                path.pop(); // 撤销选择，回溯
            }
        }
    }

    backtrack(0, []); // 从索引 0 开始构造分割
    return result;
}

/**
 * 93. 复原 IP 地址
 * 思路：回溯划分 4 段，每段长度 1-3 且值在 [0,255]，不允许前导 0（除单个 0）。
 * @param {string} s - 仅数字的字符串
 * @returns {string[]} - 所有可能的有效 IP 地址
 */
function restoreIpAddresses(s) {
    const result = [];

    function isValidSegment(seg) {
        if (seg.length === 0 || seg.length > 3) return false;
        if (seg.length > 1 && seg[0] === '0') return false;
        const val = Number(seg);
        return val >= 0 && val <= 255;
    }

    function backtrack(startIndex, segments) {
        if (segments.length === 4) {
            if (startIndex === s.length) {
                result.push(segments.join('.'));
            }
            return;
        }
        for (let len = 1; len <= 3; len++) {
            if (startIndex + len > s.length) break;
            const seg = s.slice(startIndex, startIndex + len);
            if (!isValidSegment(seg)) continue;
            segments.push(seg);
            backtrack(startIndex + len, segments);
            segments.pop();
        }
    }

    backtrack(0, []);
    return result;
}