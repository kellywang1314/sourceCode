// O(n^2) 稳定
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

// 增加标示位
function bubbleSort2(arr) {
    var i = arr.length-1  //初始时,最后位置保持不变
    while ( i > 0) {
        var flag = 0 //每趟开始时,无记录交换
        for (var j= 0; j< i; j++)
            if (arr[j]> arr[j+1]) {
                flag= j; //记录交换的位置,flag之后的均已交换成功
                var tmp = arr[j];
　　　　　　　　　 arr[j]=arr[j+1];
　　　　　　　　　 arr[j+1]=tmp;
            }
        i = flag; //为下一趟排序作准备，只要扫描到flag位置即可
     }
     return arr;
}