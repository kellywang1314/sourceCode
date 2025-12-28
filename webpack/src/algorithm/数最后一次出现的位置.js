// 实现一个函数 findLastIndex(), 
// 返回指定数在“有序”数组中最后一次出现的位置findLastIndex([1,2,3,3,3,4,5], 3), 返回 4
// 注意这种查找最后一次出现的题目: 先排序，在二分查找
// 我写的方法
function findLastIndex(arr=[],target) {
    if(arr.length === 0 && !arr.includes(target)) return -1
    if(arr.length === 1 && arr[0]===target) return 0
    let res = arr.reduce((cum,item)=>{
        cum[item] = (cum[item] || 0) + 1
        return cum
    },{})
    let last = -1
    for(let i in res){
        if(Number(i) == target){
            last =  arr.indexOf(target) + res[i] -1
        }
    }
    return last
}

// 二分查找
function findLastIndex(arr=[],target){
    if(arr.length === 0 && !arr.includes(target)) return -1
    if(arr.length === 1 && arr[0]===target) return 0
    let left = 0,right = arr.length-1, mid = Math.floor((left+right)/2), pos = -1
    if(arr[left] != arr[right]){
        while(Math.abs(left-right) != 1){
            if(arr[mid] === target){
                pos = mid
                left = mid
                mid = Math.floor((left+right)/2)
            }else if(arr[mid] > target){
                right = mid
                mid = Math.floor((left+right)/2)
            }else{
                left = mid
                mid = Math.floor((left+right)/2)
            }
        }
    }else{
        pos = arr.length-1
    }
    return pos
}