/*
 * @Author: your name
 * @Date: 2020-08-07 09:50:34
 * @LastEditTime: 2021-07-11 19:06:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sourceCode/js/排序/选择排序.js
 */
// 选择排序 O(n^2) 不稳定
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
