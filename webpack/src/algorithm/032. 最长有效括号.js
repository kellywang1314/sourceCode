/**给定一个只包含 '(' 和 ')' 的字符串，找出最长的包含有效括号的子串的长度。
 *
 * 输入: "(()"
 * 输出: 2
 * 解释: 最长有效括号子串为 "()"
 *
 * 输入: ")()())"
 * 输出: 4
 * 解释: 最长有效括号子串为 "()()"
 */

/**解题思路：

1.需有一个变量start记录有效括号子串的起始下标，max表示最长有效括号子串长度，初始值均为0
2.遍历字符串中的所有字符

    2.1若当前字符s[index]为左括号'('，将当前字符下标index入栈（下标稍后有其他用处），处理下一字符

    2.2若当前字符s[index]为右括号')'，判断当前栈是否为空

        2.2.1若栈为空，则start = index + 1，处理下一字符（当前字符右括号下标不入栈）

        2.2.2若栈不为空，则出栈（由于仅左括号入栈，则出栈元素对应的字符一定为左括号，可与当前字符右括号配对），判断栈是否为空

            2.2.2.1若栈为空，则max = max(max, index-start+1)

            2.2.2.2若栈不为空，则max = max(max, index-栈顶元素值)
 *
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function (s) {
  if (!s) return 0;

  let start = 0;
  let result = 0;
  let stack = [];
  for (let i = 0, len = s.length; i < len; i++) {
    if (s[i] === '(') {
      stack.push(i);
    } else {
      if (!stack.length) {
        start = i + 1;
      } else {
        stack.pop();
        if (!stack.length) {
          result = Math.max(result, i - start + 1);
        } else {
          result = Math.max(result, i - stack[stack.length - 1])
        }
      }

    }
  }

  return result;
};

/**非动态规划版本
 * 将整个s进行上述的入栈出栈操作，剩余项即为不符合项
 * 将空缺的位置索引进行相减，其中的最大值即为题目所求
 *
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses2 = function (s) {
  if (!s) return 0;
  let stack = [];

  //  s按规则进行压栈、出栈操作
  for (let i = 0, len = s.length; i < len; i++) {
    if (s[i] === '(' || i === 0) {
      stack.push({
        index: i,
        bracket: s[i]
      });
    } else {
      if (stack.length && stack[stack.length - 1].bracket === '(') {
        stack.pop();
      } else {
        stack.push({
          index: i,
          bracket: s[i]
        })
      }
    }
  }

  let maxLength = 0;
  //  获取最长有效括号的子串长度
  if (!stack.length) return s.length;
  //  当最后一位出栈了，无法计算括号长度时
  if (stack[stack.length - 1].index !== s.length - 1) stack.push({index: s.length});
  //  当第一位出栈了
  if (stack[0].index !== 0) maxLength = stack[0].index;
  for (let i = 0, len = stack.length; i < len; i++) {
    if (i + 1 < len && stack[i].index + 1 !== stack[i + 1].index) {
      maxLength = Math.max(maxLength, stack[i + 1].index - stack[i].index - 1);
    }
  }

  console.log(stack)
  return maxLength;
};

// var s = ')())()((()()('
var s = '(()'
console.log(longestValidParentheses(s));