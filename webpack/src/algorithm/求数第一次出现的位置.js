function findFirstIndex(arr=[],target){
    if(arr.length === 0 && !arr.includes(target)) return -1
    if(arr.length === 1 && arr[0]===target) return 0
    let left = 0,right = arr.length-1, mid = Math.floor((left+right)/2), pos = -1
    if(arr[left] != arr[right]){
        while(Math.abs(left-right) != 1){
            if(arr[mid] === target){
                pos = mid
                right = mid
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
        pos = 0
    }
    return pos
}