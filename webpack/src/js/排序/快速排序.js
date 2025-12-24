/*
 * @Author: your name
 * @Date: 2020-08-09 14:41:05
 * @LastEditTime: 2021-07-11 18:56:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /sourceCode/js/排序/快速排序.js
 */
//快排 O(nlogn)， 不稳定
function quickSort(arr =[]){
    if(arr.length<=1) return arr
    let pos = Math.floor(arr.length/2)
    let posvalue = arr.splice(pos,1)[0]
    let low = [],high = []
    for(let i=0; i<arr.length; i++){
        if(arr[i]<posvalue){
            low.push(arr[i])
        }else{
            high.push(arr[i])
        }
    }
    return [...Quick(low),posvalue,...Quick(high)]
        
}
 