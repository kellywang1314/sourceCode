// 每次选择最小的放到前面
function selectSort(arr){
    let len = arr.length
    for(let i=0; i<len; i++){
        let min = i
        for(let j=i+1;j<len;j++){
            if(arr[j]<arr[min]){
                min = j
            }
        }
        let temp = arr[i]
        arr[i] = arr[min]
        arr[min] = temp
    }
    return arr
}