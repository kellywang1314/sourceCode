import { longestSubstringWithoutRepeating, isAnagram, validPalindrome } from '../../code/strings.js'

function expectEqual(a, b) { if (a != b) throw new Error(`${a} != ${b}`) }
function expectStrictEqual(a, b) { if (a !== b) throw new Error(`${a} !== ${b}`) }

/**
 * run
 * 执行字符串题目的单测
 */
export async function run() {
  let passed = 0, failed = 0
  const test = (name, fn) => { try { fn(); passed++ } catch (e) { failed++; console.error(`strings:${name}:`, e.message) } }

  test('longestSubstringWithoutRepeating basic', () => {
    expectEqual(longestSubstringWithoutRepeating('abcabcbb'), 3)
    expectEqual(longestSubstringWithoutRepeating('bbbbb'), 1)
    expectEqual(longestSubstringWithoutRepeating('pwwkew'), 3)
  })

  test('isAnagram basic', () => {
    expectStrictEqual(isAnagram('anagram', 'nagaram'), true)
    expectStrictEqual(isAnagram('rat', 'car'), false)
  })

  test('validPalindrome filter alnum', () => {
    expectStrictEqual(validPalindrome('A man, a plan, a canal: Panama'), true)
    expectStrictEqual(validPalindrome('race a car'), false)
  })

  console.log(`strings tests: ${passed} passed, ${failed} failed`)
  return { passed, failed }
}

