// 插入排序  O(n^2) 稳定
function insertSort(arr = []){
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


function insertSort(arr){
    let len = arr.length
    let index,insert
    for(let i=0;i<len-1;i++){
        index = i+1
        insert = arr[i+1]
        for(let j=i;j>=0;j--){
            if(insert < arr[j]){
                arr[j+1] = arr[j]
                index = j
            }
        } 
        arr[index] = insert 
    }
    return arr
}
    