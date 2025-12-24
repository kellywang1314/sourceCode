// 归并排序 时间复杂度o(nlogn) 空间复杂度o(n) 稳定

function merge(left, right){
    let result = [];
    while(left.length >0 && right.length > 0){
        if(left[0]<right[0]){
            result.push(left.shift());
        }else{
            result.push(right.shift());
        }
    }
    return result.concat(left).concat(right);
}

function mergeSort(arr=[]){
    if(arr.length < 2) return arr
    let mid = Math.floor(arr.length/2),
        left = arr.slice(0,mid),
        right = arr.slice(mid)
    return merge(mergeSort(left),mergeSort(right))
}