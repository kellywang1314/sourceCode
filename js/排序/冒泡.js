function BubbleSort(arr){
    let len = arr.length
    for(let i=0; i<len;i++){
        for(let j=0; j<=len-i;j++){
            let temp
            if(arr[j] > arr[j+1]){
                temp = arr[i]
                arr[i] = arr[j+1]
                arr[j+1] = temp
            }
        }
    }
    return arr
}