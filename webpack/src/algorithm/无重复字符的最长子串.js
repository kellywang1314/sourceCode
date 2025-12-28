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


var twoSum = function(nums, target) {
  if(nums.length < 1) return []
  let res =[]
  let Nums = nums.slice(0)
  let arrSort = Nums.sort((a,b) => {return a-b})
  let left = 0, right = nums.length-1
  while(left < right){
      if(arrSort[left] + arrSort[right] === target){
          res.push([nums.indexOf(arrSort[left]),nums.indexOf(arrSort[right])])
          left++
          right--
      }else if(arrSort[left] + arrSort[right] < target){
          left++
      }else{
          right--
      }
  }
  return res[0]
};