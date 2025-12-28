// 请实现一个函数，功能为合并两个升序数组为一个升序数组

function merge(arr1=[],arr2=[]){
    let left = 0, right = 0, res = []
    while(left < arr1.length && right < arr2.length){
        if(arr1[left] <= arr2[right]){
            res.push(arr1[left++])
        }else{
            res.push(arr2[right++])
        }
    }
    return res.concat(arr1.slice(left)).concat(arr2.slice(right))
}