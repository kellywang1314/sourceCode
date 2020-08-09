// 归并排序 时间复杂度o(nlogn) 空间复杂度o(n) 稳定

function merge(left, right){
    let result = [], il = 0, ir = 0
    while(il < left.length && ir < right.length){
        if(left[il] < right[ir]){
            result.push(left[il++])
        }else{
            result.push(left[ir++])
        }
    }
    return result.concat(left.slice(il)).concat(right.slice(ir))
}

function mergeSort(arr=[]){
    if(arr.length < 2) return arr
    let mid = Math.floor(arr/2),
        left = arr.slice(0,mid),
        right = arr.slice(mid)
    return merge(mergeSort(left),mergeSort(right))
}