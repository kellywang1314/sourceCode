var longestCommonPrefix = function(strs) {
    let firstStr = strs[0] || ''
    let str = ''
    outer: 
    for (let i = 0, len = firstStr.length; i < len; i++) {
      const char = firstStr[i]
      str += char
      for (let j = 0, len2 = strs.length; j < len2; j++) {
        const element = strs[j]
        if (element.indexOf(str) === -1) {
          str = str.slice(0, -1)
          break outer
        }
      }
    }
    return str
};
