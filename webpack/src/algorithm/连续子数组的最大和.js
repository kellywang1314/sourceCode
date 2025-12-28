// [6,-3,-2,7,-15,1,2,2]
// 遍历数组，遇到负的和则放弃之前的结果，重新积累，这期间保留最大值；
// 用sum记录最终返回的最大和，用temp记录累计值；
// 对于数组中的一个数array[i]，若其左边的累加和非负,那么加上array[i]；
// 判断此时的temp是否大于sum，若大于此时的sum，则用sum记录下来。

function FindGreatestSumOfSubArray(array)
{
    // write code here
    if(array.length <= 0) return 0
    var sum = array[0]
    var temp = array[0]
    for (var i = 1;i<array.length;i++){
        if(temp < 0){
            temp = array[i];
        }else{
            temp = temp + array[i];
        }
        max = Math.max(temp,max)
    }
    return sum;
}
