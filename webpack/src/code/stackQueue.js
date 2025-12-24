/**
 * validParentheses
 * 判断括号字符串是否有效（栈）
 * @param {string} s 输入字符串
 * @returns {boolean} 是否有效
 */
export function validParentheses(s) {
  const stack = []
  const pair = { ')': '(', ']': '[', '}': '{' }
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch)
    else {
      if (!stack.length || stack.pop() !== pair[ch]) return false
    }
  }
  return stack.length === 0
}

