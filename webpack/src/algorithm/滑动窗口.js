/**
 * 找到字符串中所有字母异位词（LeetCode 438）
 * 思路：滑动窗口 + 计数；窗口长度固定为 p.length，当窗口内字符计数与 p 相同即记录起始索引。
 * @param {string} s - 主串
 * @param {string} p - 模式串（要匹配其异位词）
 * @returns {number[]} - 所有异位词的起始索引列表
 * 时间复杂度：O(n)，n 为 s 的长度；空间复杂度：O(k)，k 为 p 中不同字符数
 */
function findAnagrams(s, p) {
  const result = [];
  if (!s || !p || p.length > s.length) return result;

  const needMap = new Map();
  for (let i = 0; i < p.length; i++) {
    const ch = p[i];
    needMap.set(ch, (needMap.get(ch) || 0) + 1);
  }
  const windowMap = new Map();
  let left = 0;
  let right = 0;
  let valid = 0;
  const needKinds = needMap.size;

  while (right < s.length) {
    const ch = s[right];
    right++;
    if (needMap.has(ch)) {
      windowMap.set(ch, (windowMap.get(ch) || 0) + 1);
      if (windowMap.get(ch) === needMap.get(ch)) valid++;
    }

    while (right - left >= p.length) {
      if (valid === needKinds) result.push(left);
      const leftCh = s[left];
      left++;
      if (needMap.has(leftCh)) {
        if (windowMap.get(leftCh) === needMap.get(leftCh)) valid--;
        windowMap.set(leftCh, (windowMap.get(leftCh) || 0) - 1);
      }
    }
  }

  return result;
}
/**
 * 给定一个字符串，找出不含有重复字符的最长子串的长度。 
 * 参考 https://blog.csdn.net/Tracy_frog/article/details/79643530
 */
/**
 * @param {string} s
 * @return {number}
 */
const lengthOfLongestSubstring = function (s) {
  if (!s) return 0
  const map = {}
  let max = 1
  // i和j是两个指针
  for (let i = 0, j = 0; j < s.length; j++) {
    // 该条件证明有重复字串
    if (s.indexOf(s[j]) !== j) {
      i = i <= map[s[j]] ? map[s[j]] + 1 : i
      console.log(i,j)
    }
    max = Math.max(max, j - i + 1)
    map[s[j]] = j

  }
  return max
};

lengthOfLongestSubstring('wcibxubumenmeyatdrmydiajxloghiqfmzhlvihjouvsuyoypayulyeimuotehzriicfskpggkbbipzzrzucxamludfyk')
// lengthOfLongestSubstring('abcbadbb123')
// lengthOfLongestSubstring("pwwkew")
// lengthOfLongestSubstring("dvdf")

// console.log(notRepeated('abc123'))




// 找到字符串中所有字母异位词
