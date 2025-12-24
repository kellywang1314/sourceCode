// 插入排序  O(n^2) 稳定
function insertSort(arr = [0,-1,4,9,2,1]){
    let len = arr.length
    for(let i=0;i<len;i++){
        for(let j=i;j>=0;j--){
            if(arr[j]<arr[j+1]){
                let temp = arr[j]
                arr[j] = arr[j+1]
                arr[j+1] = temp
            }
        }
    }
    return arr

}