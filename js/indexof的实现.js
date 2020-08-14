// 使用循环实现indexof

var strStr = function(haystack, needle) {
    var len1 = haystack.length
    var len2 = needle.length
    if(len2>len1) return -1
    if(!needle) return 0
    let i = 0
    for(;i<=len1-len2;i++){
        let flag = true
        for(let j=0; j<len2;j++){
            if(haystack[i+j] != needle[j]){
                flag = false
                break;
            }
        }
        if(flag){
            return i
        }
    }
    
    return -1

};