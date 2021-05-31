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

// 这是错的！！！
function insertSort(arr = [0,-1,4,9,2,1]){
    // 注意i的结束位置
    for(let i=0; i<arr.length-1; i++){
      let insert = i+1
      let temp = arr[i+1]
      for(let j=i;j>=0;j--){
        if(arr[j] > arr[insert]){
           insert = j
        }
      }
      arr[i+1] = arr[insert]
      arr[insert] = temp
    }
    return arr
  }
  insertSort()