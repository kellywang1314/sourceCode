/**
 * longestSubstringWithoutRepeating
 * 返回不含重复字符的最长子串长度（滑动窗口）
 * @param {string} s 输入字符串
 * @returns {number} 最长长度
 */
export function longestSubstringWithoutRepeating(s) {
  const seen = new Map()
  let left = 0
  let best = 0
  for (let right = 0; right < s.length; right++) {
    const ch = s[right]
    if (seen.has(ch) && seen.get(ch) >= left) left = seen.get(ch) + 1
    seen.set(ch, right)
    best = Math.max(best, right - left + 1)
  }
  return best
}

/**
 * isAnagram
 * 判断两个字符串是否为字母异位词
 * @param {string} s 字符串 s
 * @param {string} t 字符串 t
 * @returns {boolean} 是否为异位词
 */
export function isAnagram(s, t) {
  if (s.length !== t.length) return false
  const cnt = new Map()
  for (const c of s) cnt.set(c, (cnt.get(c) || 0) + 1)
  for (const c of t) {
    if (!cnt.has(c)) return false
    const v = cnt.get(c) - 1
    if (v === 0) cnt.delete(c)
    else cnt.set(c, v)
  }
  return cnt.size === 0
}

/**
 * validPalindrome
 * 仅考虑字母数字，忽略大小写，判断是否回文
 * @param {string} s 输入字符串
 * @returns {boolean} 是否回文
 */
export function validPalindrome(s) {
  const arr = []
  for (const ch of s.toLowerCase()) {
    if ((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9')) arr.push(ch)
  }
  let i = 0, j = arr.length - 1
  while (i < j) {
    if (arr[i] !== arr[j]) return false
    i++; j--
  }
  return true
}

